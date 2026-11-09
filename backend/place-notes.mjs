import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {places} from '../shared/places.mjs';

const submission = z.object({
  place: z.enum(places.map(p=>p.id)),
  name: z.string().trim().max(40).default(''),
  note: z.string().trim().min(10,'Please write at least 10 characters.').max(500),
  consent: z.literal(true,{error:'Please confirm this is your experience and that it may be published.'}),
  website: z.string().max(0).default('')
}).strict();
const visibility = z.enum(['pending','published']);

export function openPlaceNotes(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS place_notes (
    id TEXT PRIMARY KEY, place TEXT NOT NULL, name TEXT NOT NULL, note TEXT NOT NULL,
    consent INTEGER NOT NULL CHECK(consent=1), created TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published'))
  ); CREATE INDEX IF NOT EXISTS place_notes_queue ON place_notes(status,created DESC);
     CREATE INDEX IF NOT EXISTS place_notes_by_place ON place_notes(place,status,created DESC);`);
  return {
    submit(body) {
      const b=submission.parse(body), id=randomUUID();
      db.prepare('INSERT INTO place_notes (id,place,name,note,consent,created) VALUES (?,?,?,?,1,?)')
        .run(id,b.place,b.name||'Anonymous traveller',b.note,new Date().toISOString());
      return id;
    },
    published() {
      const rows=db.prepare("SELECT place,name,note FROM place_notes WHERE place=? AND status='published' ORDER BY created DESC,id DESC LIMIT 3");
      return places.flatMap(p=>rows.all(p.id));
    },
    list(filter,offset) {
      const status=visibility.parse(filter);
      const page=z.number().int().nonnegative().max(1000000).parse(offset);
      return {
        items:db.prepare('SELECT id,place,name,note,created,status FROM place_notes WHERE status=? ORDER BY created DESC,id DESC LIMIT 20 OFFSET ?').all(status,page),
        total:db.prepare('SELECT COUNT(*) AS n FROM place_notes WHERE status=?').get(status).n
      };
    },
    setStatus(id,body) {
      const {status}=z.object({status:visibility}).strict().parse(body);
      return db.prepare('UPDATE place_notes SET status=? WHERE id=?').run(status,id).changes;
    },
    remove(id) {return db.prepare('DELETE FROM place_notes WHERE id=?').run(id).changes}
  };
}
