import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,existsSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const source=resolve(process.env.DATABASE_PATH||'data/serendib.sqlite'),destination=resolve(process.argv[2]||'backups/serendib-'+new Date().toISOString().replaceAll(':','-')+'.sqlite');
if(!existsSync(source))throw Error('Database does not exist. Check DATABASE_PATH.');
if(existsSync(destination))throw Error('Choose a new filename; backups are never overwritten.');
mkdirSync(dirname(destination),{recursive:true,mode:0o700});const db=new DatabaseSync(source);
try{db.exec('PRAGMA busy_timeout=10000');db.prepare('VACUUM INTO ?').run(destination);chmodSync(destination,0o600);console.log('Consistent database backup saved: '+destination)}finally{db.close()}
