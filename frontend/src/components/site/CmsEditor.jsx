import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus, Trash2, Save, ArrowUp, ArrowDown, RotateCcw, Loader2, Edit3,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// --- Schemas describe the form fields for each collection. ----------------
// Keys match backend cms_defaults.py. Each entry describes either
//   type: "list"      — editable array of items with given field schema
//   type: "singleton" — single object with given field schema
// Fields: { name, label, type (text|textarea|number|url|email), placeholder? }
// Admins never see the underlying Mongo shape.

const TEXT = "text";
const TEXTAREA = "textarea";
const NUMBER = "number";
const URL = "url";
const EMAIL = "email";

export const CMS_SCHEMAS = {
  settings: {
    type: "singleton",
    label: "Site settings",
    description: "Brand, contact, hero, SEO and analytics — global to the whole site.",
    fields: [
      { name: "brand_name", label: "Brand name", type: TEXT },
      { name: "tagline", label: "Tagline", type: TEXT },
      { name: "email", label: "Public email", type: EMAIL },
      { name: "whatsapp_number", label: "WhatsApp number (with +CC)", type: TEXT },
      { name: "location", label: "Location (city, country)", type: TEXT },
      { name: "currency_default", label: "Default currency", type: TEXT },
      { name: "instagram_handle", label: "Instagram handle", type: TEXT },
      { name: "hero_eyebrow", label: "Hero — eyebrow", type: TEXT },
      { name: "hero_title", label: "Hero — title", type: TEXT },
      { name: "hero_sub", label: "Hero — sub-heading", type: TEXTAREA },
      { name: "hero_image", label: "Hero — image URL", type: URL },
      { name: "seo_title", label: "SEO — <title>", type: TEXT },
      { name: "seo_description", label: "SEO — meta description", type: TEXTAREA },
      { name: "seo_keywords", label: "SEO — meta keywords", type: TEXT },
      { name: "seo_og_image", label: "SEO — Open Graph image URL", type: URL },
      { name: "site_url", label: "Public site URL (https://…)", type: URL },
      { name: "analytics_plausible_domain", label: "Plausible domain (optional)", type: TEXT },
    ],
  },
  services: {
    type: "list", label: "Services",
    description: "The three service cards on the home page.",
    fields: [
      { name: "slug", label: "Slug", type: TEXT }, { name: "title", label: "Title", type: TEXT },
      { name: "desc", label: "Description", type: TEXTAREA }, { name: "price", label: "Price label", type: TEXT },
      { name: "icon", label: "Icon name (Plane | MapPin | Sparkles)", type: TEXT },
      { name: "cta", label: "CTA type (quickbook | book)", type: TEXT },
      { name: "mode", label: "Quick-book mode (airport | dayTour)", type: TEXT },
      { name: "badge", label: "Badge text (optional)", type: TEXT },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  vehicles: {
    type: "list", label: "Vehicles",
    description: "Vehicles section + trip-builder daily rates.",
    fields: [
      { name: "id", label: "ID (sedan/suv/van)", type: TEXT },
      { name: "label", label: "Label", type: TEXT }, { name: "seats", label: "Seats", type: TEXT },
      { name: "dailyUSD", label: "Daily rate USD", type: NUMBER },
      { name: "icon", label: "Icon (Car | Truck | Bus)", type: TEXT },
      { name: "image", label: "Image URL", type: URL }, { name: "order", label: "Order", type: NUMBER },
    ],
  },
  locations: {
    type: "list", label: "Trip locations",
    description: "Stops shown in the trip-builder. Regions: Capital, West Coast, Cultural Triangle, Hill Country, South Coast, East Coast, North.",
    fields: [
      { name: "slug", label: "Slug", type: TEXT }, { name: "name", label: "Name", type: TEXT },
      { name: "region", label: "Region", type: TEXT }, { name: "note", label: "Short note", type: TEXT },
      { name: "emoji", label: "Emoji", type: TEXT },
    ],
  },
  trip_experiences: {
    type: "list", label: "Trip experiences",
    description: "Optional add-ons shown on trip-builder step 3.",
    fields: [
      { name: "slug", label: "Slug", type: TEXT }, { name: "label", label: "Label", type: TEXT },
      { name: "emoji", label: "Emoji", type: TEXT },
    ],
  },
  stay_budgets: {
    type: "list", label: "Stay budget bands",
    fields: [
      { name: "id", label: "ID", type: TEXT }, { name: "label", label: "Label", type: TEXT },
      { name: "range", label: "Price range", type: TEXT }, { name: "note", label: "Note", type: TEXT },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  stay_styles: {
    type: "list", label: "Stay styles",
    fields: [{ name: "id", label: "ID", type: TEXT }, { name: "label", label: "Label", type: TEXT }],
  },
  reviews: {
    type: "list", label: "Reviews",
    fields: [
      { name: "quote", label: "Quote", type: TEXTAREA }, { name: "name", label: "Name", type: TEXT },
      { name: "origin", label: "Origin", type: TEXT }, { name: "rating", label: "Rating (1-5)", type: NUMBER },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  faqs: {
    type: "list", label: "FAQ",
    fields: [
      { name: "q", label: "Question", type: TEXT }, { name: "a", label: "Answer", type: TEXTAREA },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  concierge: {
    type: "list", label: "Concierge services",
    fields: [
      { name: "icon", label: "Icon (Utensils | Bed | Ticket | Train | Activity | ShieldCheck)", type: TEXT },
      { name: "title", label: "Title", type: TEXT }, { name: "desc", label: "Description", type: TEXTAREA },
    ],
  },
  sample_routes: {
    type: "list", label: "Sample routes",
    fields: [
      { name: "slug", label: "Slug", type: TEXT }, { name: "title", label: "Title", type: TEXT },
      { name: "days", label: "Days label", type: TEXT }, { name: "stops", label: "Stops", type: TEXT },
      { name: "blurb", label: "Blurb", type: TEXTAREA }, { name: "price", label: "Price label", type: TEXT },
      { name: "image", label: "Image URL", type: URL }, { name: "order", label: "Order", type: NUMBER },
    ],
  },
  team: {
    type: "list", label: "Team",
    fields: [
      { name: "name", label: "Name", type: TEXT }, { name: "role", label: "Role", type: TEXT },
      { name: "bio", label: "Bio", type: TEXTAREA }, { name: "image", label: "Image URL", type: URL },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  blog_posts: {
    type: "list", label: "Blog posts",
    description: "Articles shown on /blog and the home-page carousel (featured = true).",
    fields: [
      { name: "slug", label: "Slug (URL)", type: TEXT },
      { name: "title", label: "Title", type: TEXT },
      { name: "excerpt", label: "Excerpt", type: TEXTAREA },
      { name: "cover_image", label: "Cover image URL", type: URL },
      { name: "author", label: "Author", type: TEXT },
      { name: "published_at", label: "Published (YYYY-MM-DD)", type: TEXT },
      { name: "read_minutes", label: "Read time (minutes)", type: NUMBER },
      { name: "tag", label: "Tag / category", type: TEXT },
      { name: "featured", label: "Show on home carousel? (true/false)", type: TEXT },
      { name: "body", label: "Body (use blank lines for paragraphs; **bold**, *italic*)", type: TEXTAREA },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
  team_section: {
    type: "singleton", label: "Team section (copy)",
    description: "Narrative text + sidebar for the 'Meet the team' section.",
    fields: [
      { name: "eyebrow", label: "Eyebrow (uppercase label)", type: TEXT },
      { name: "heading", label: "Heading", type: TEXT },
      { name: "paragraph_1", label: "Paragraph 1", type: TEXTAREA },
      { name: "paragraph_2", label: "Paragraph 2", type: TEXTAREA },
      { name: "paragraph_3", label: "Paragraph 3", type: TEXTAREA },
      { name: "paragraph_4", label: "Paragraph 4 (closing line)", type: TEXTAREA },
      { name: "basic_1", label: "Sidebar basic #1", type: TEXT },
      { name: "basic_2", label: "Sidebar basic #2", type: TEXT },
      { name: "basic_3", label: "Sidebar basic #3", type: TEXT },
      { name: "footer_note", label: "Sidebar footer note", type: TEXTAREA },
    ],
  },
  experiences: {
    type: "list", label: "Experiences gallery",
    fields: [
      { name: "title", label: "Title", type: TEXT }, { name: "caption", label: "Caption", type: TEXT },
      { name: "image", label: "Image URL", type: URL },
    ],
  },
  trust_items: {
    type: "list", label: "Trust bar items",
    fields: [
      { name: "label", label: "Label", type: TEXT },
      { name: "icon", label: "Icon (ShieldCheck | Star | Car | Leaf)", type: TEXT },
      { name: "order", label: "Order", type: NUMBER },
    ],
  },
};

export const CMS_KEYS = Object.keys(CMS_SCHEMAS);

function InputField({ field, value, onChange, dataTestid }) {
  const common = {
    value: value ?? "",
    onChange: (e) => onChange(field.type === NUMBER ? Number(e.target.value) || 0 : e.target.value),
    "data-testid": dataTestid,
    className: "w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-3 py-2 text-sm text-[#111827]",
    placeholder: field.placeholder || "",
  };
  if (field.type === TEXTAREA) return <textarea rows={3} {...common} className={common.className + " resize-y min-h-[72px]"} />;
  if (field.type === NUMBER) return <input type="number" {...common} />;
  if (field.type === URL)    return <input type="url" {...common} />;
  if (field.type === EMAIL)  return <input type="email" {...common} />;
  return <input type="text" {...common} />;
}

export default function CmsEditor({ token }) {
  const [activeKey, setActiveKey] = useState(CMS_KEYS[0]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/cms`);
      setContent(res.data || {});
    } catch (err) {
      toast.error("Could not load CMS", { description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const schema = CMS_SCHEMAS[activeKey];
  const isList = schema.type === "list";
  const value = content[activeKey] ?? (isList ? [] : {});

  const updateValue = (next) => setContent((prev) => ({ ...prev, [activeKey]: next }));

  const updateItem = (idx, patch) => {
    const arr = [...value];
    arr[idx] = { ...arr[idx], ...patch };
    updateValue(arr);
  };

  const moveItem = (idx, dir) => {
    const arr = [...value];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    updateValue(arr);
  };

  const removeItem = (idx) => {
    if (!window.confirm("Remove this item?")) return;
    const arr = value.filter((_, i) => i !== idx);
    updateValue(arr);
  };

  const addItem = () => {
    const blank = {};
    schema.fields.forEach((f) => { blank[f.name] = f.type === NUMBER ? 0 : ""; });
    updateValue([...value, blank]);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = isList ? { items: value } : { data: value };
      await axios.put(`${API}/admin/cms/${activeKey}`, body, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Saved · ${schema.label}`);
    } catch (err) {
      toast.error("Save failed", { description: err?.response?.data?.detail || err?.message });
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!window.confirm(`Reset "${schema.label}" to shipped defaults? Your edits for this collection will be lost.`)) return;
    setSaving(true);
    try {
      await axios.post(`${API}/admin/cms/${activeKey}/reset`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Reset to defaults");
      await loadAll();
    } catch (err) {
      toast.error("Reset failed", { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo(() => CMS_KEYS.map((k) => ({ id: k, label: CMS_SCHEMAS[k].label })), []);

  return (
    <div data-testid="cms-editor">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" data-testid="cms-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveKey(t.id)}
            data-testid={`cms-tab-${t.id}`}
            className={`rounded-full px-4 py-2 text-xs font-medium border transition-all ${
              activeKey === t.id
                ? "bg-jungle-700 border-jungle-700 text-sand-50"
                : "bg-sand-50 border-sand-200 text-[#4B5563] hover:border-jungle-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-sand-200 bg-sand-50 p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 pb-5 border-b border-sand-200">
          <div>
            <h3 className="font-display text-2xl text-[#111827]">{schema.label}</h3>
            {schema.description && <p className="mt-1 text-sm text-[#4B5563] max-w-xl">{schema.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetDefaults}
              disabled={saving}
              data-testid="cms-reset"
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 text-[#4B5563] hover:border-clay-500 hover:text-clay-500 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading}
              data-testid="cms-save"
              className="inline-flex items-center gap-1.5 rounded-full bg-clay-500 hover:bg-clay-600 text-white px-5 py-2 text-sm font-medium disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#4B5563] text-sm inline-flex items-center gap-2 justify-center w-full">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : isList ? (
          <div className="space-y-4" data-testid="cms-items">
            {value.length === 0 && (
              <div className="py-12 text-center text-[#4B5563] text-sm">
                No items yet — click "Add item" below.
              </div>
            )}
            {value.map((item, idx) => (
              <div
                key={idx}
                data-testid={`cms-item-${idx}`}
                className="rounded-xl border border-sand-200 bg-sand-50 p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-clay-500 font-semibold">
                    <Edit3 className="h-3 w-3" /> Item #{idx + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveItem(idx, -1)} data-testid={`cms-move-up-${idx}`} className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-sand-200 hover:border-jungle-700 text-[#4B5563] hover:text-jungle-700"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => moveItem(idx, 1)} data-testid={`cms-move-down-${idx}`} className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-sand-200 hover:border-jungle-700 text-[#4B5563] hover:text-jungle-700"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeItem(idx)} data-testid={`cms-remove-${idx}`} className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-sand-200 hover:border-clay-500 text-[#4B5563] hover:text-clay-500 ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schema.fields.map((f) => (
                    <label key={f.name} className="block">
                      <span className="text-[11px] uppercase tracking-wider text-[#4B5563] mb-1 block">{f.label}</span>
                      <InputField
                        field={f}
                        value={item?.[f.name]}
                        onChange={(v) => updateItem(idx, { [f.name]: v })}
                        dataTestid={`cms-${activeKey}-${idx}-${f.name}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              data-testid="cms-add-item"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-sand-200 hover:border-jungle-700 text-[#4B5563] hover:text-jungle-700 py-4 text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="cms-singleton">
            {schema.fields.map((f) => (
              <label key={f.name} className={"block " + (f.type === TEXTAREA ? "md:col-span-2" : "")}>
                <span className="text-[11px] uppercase tracking-wider text-[#4B5563] mb-1 block">{f.label}</span>
                <InputField
                  field={f}
                  value={value?.[f.name]}
                  onChange={(v) => updateValue({ ...value, [f.name]: v })}
                  dataTestid={`cms-${activeKey}-${f.name}`}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
