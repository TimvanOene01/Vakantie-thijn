const pageMode = document.body.dataset.page === "admin" ? "admin" : "public";
const supabaseLib = window.supabase;

const photoFeed = document.querySelector("#photoFeed");
const heroKickerEl = document.querySelector(".hero-kicker");
const heroTitleEl = document.querySelector(".hero h1");
const heroCopyEl = document.querySelector(".hero-copy");
const heroButtonEl = document.querySelector(".hero-jump");

const adminLoginCard = document.querySelector("#adminLoginCard");
const adminDashboard = document.querySelector("#adminDashboard");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginStatus = document.querySelector("#adminLoginStatus");
const adminStatus = document.querySelector("#adminStatus");
const adminPhotoList = document.querySelector("#adminPhotoList");
const adminCommentList = document.querySelector("#adminCommentList");
const visitCountEl = document.querySelector("#visitCount");
const commentCountEl = document.querySelector("#commentCount");
const photoCountEl = document.querySelector("#photoCount");
const logoutAdminButton = document.querySelector("#logoutAdminButton");

const heroKickerInput = document.querySelector("#heroKickerInput");
const heroTitleInput = document.querySelector("#heroTitleInput");
const heroCopyInput = document.querySelector("#heroCopyInput");
const heroButtonInput = document.querySelector("#heroButtonInput");

const photoTagInput = document.querySelector("#photoTagInput");
const photoOrderInput = document.querySelector("#photoOrderInput");
const photoTitleInput = document.querySelector("#photoTitleInput");
const photoCommentIdInput = document.querySelector("#photoCommentIdInput");
const photoCopyInput = document.querySelector("#photoCopyInput");
const photoNoteInput = document.querySelector("#photoNoteInput");
const photoImageInput = document.querySelector("#photoImageInput");

const saveHeroButton = document.querySelector("#saveHeroButton");
const addPhotoButton = document.querySelector("#addPhotoButton");
const refreshAdminButton = document.querySelector("#refreshAdminButton");

const supabaseConfig = {
  url: "https://lardnnecoesiazbjwilp.supabase.co",
  anonKey: "sb_publishable_FNqzAtTU_0Q7Nzp44CV5-w_Me1xOQ85",
  commentsTable: "photo_comments",
  photosTable: "photo_entries",
  settingsTable: "site_settings",
  visitsTable: "page_visits",
};

const adminCredsStorageKey = "vakantie_admin_creds_v2";

const defaultHero = {
  kicker: "Vakantie-thijn",
  title: "Scroll en oordeel later.",
  copy: "Zwarte achtergrond, domme foto's, en straks open comments onder elke foto zonder gedoe met accounts.",
  button: "begin",
};

const defaultMemories = [
  {
    tag: "02:17",
    title: "Er zijn foto's waar je geen uitleg bij wilt geven en dit is er een van",
    copy: "Je opent de pagina, scrollt omlaag en dan krijg je dit gewoon vol in beeld. Precies de juiste energie.",
    note: "Deze staat nu op plek 1.",
    image: "assets/chatgpt-image-2026-07-02-191533.png",
    comment_id: "foto-1",
    display_order: 1,
  },
  {
    tag: "13:10",
    title: "Nieuwe afbeelding op plek 2, subtiel was blijkbaar geen optie",
    copy: "Je scrolt nog geen twee seconden en dan staat dit er al pontificaal tussen.",
    note: "Afbeelding 2 is nu vervangen door je nieuwe versie.",
    image: "assets/image-2-replacement.png",
    comment_id: "foto-2",
    display_order: 2,
  },
  {
    tag: "16:28",
    title: "Plek 3 is nu vervangen door pure vakantiechaos",
    copy: "Je hoeft hier eigenlijk niets meer aan uit te leggen, de foto doet het zware werk zelf al.",
    note: "De oude derde afbeelding is vervangen door je nieuwe foto.",
    image: "assets/image-3-replacement.png",
    comment_id: "foto-3",
    display_order: 3,
  },
  {
    tag: "19:54",
    title: "Plek 4 is nu vervangen door complete meme-ellende",
    copy: "Dit is precies zo'n foto die je niet uitlegt maar gewoon laat staan voor maximaal effect.",
    note: "De oude vierde afbeelding is vervangen door je nieuwe versie.",
    image: "assets/image-4-replacement.png",
    comment_id: "foto-4",
    display_order: 4,
  },
  {
    tag: "23:43",
    title: "Plek 5 is nu vervangen door nog meer cursed energie",
    copy: "Je denkt dat het niet gekker wordt en dan scroll je precies hiernaartoe.",
    note: "Alleen plek 5 is aangepast zoals je vroeg.",
    image: "assets/image-5-replacement.png",
    comment_id: "foto-5",
    display_order: 5,
  },
  {
    tag: "08:11",
    title: "Zijaanzicht met exact nul reden om dit prive te houden",
    copy: "Dit is gewoon zo'n foto die schreeuwt om onderaan een zwarte roast-scroll te eindigen.",
    note: "Nieuwe echte foto toegevoegd als slotstuk.",
    image: "assets/IMG_4568.JPG",
    comment_id: "foto-6",
    display_order: 6,
  },
  {
    tag: "11:47",
    title: "Nog een groepsfoto die totaal geen context nodig heeft",
    copy: "Dit is precies het type beeld dat steeds erger wordt naarmate je er langer naar kijkt.",
    note: "Nieuw toegevoegd als extra kaart onderaan de feed.",
    image: "assets/image-7-added.png",
    comment_id: "foto-7",
    display_order: 7,
  },
];

if (!supabaseLib?.createClient) {
  if (pageMode === "admin" && adminLoginStatus) {
    adminLoginStatus.hidden = false;
    adminLoginStatus.dataset.error = "true";
    adminLoginStatus.textContent = "Supabase laadt niet goed. Vernieuw de pagina.";
  }
  throw new Error("Supabase library ontbreekt.");
}

const publicClient = supabaseLib.createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

let currentHero = { ...defaultHero };
let currentPhotos = defaultMemories.map((memory) => ({ ...memory }));
let adminCreds = readAdminCreds();
let adminClient = createAdminClient(adminCreds);

function readAdminCreds() {
  try {
    const raw = sessionStorage.getItem(adminCredsStorageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAdminCreds(creds) {
  adminCreds = creds;
  adminClient = createAdminClient(creds);

  if (creds) {
    sessionStorage.setItem(adminCredsStorageKey, JSON.stringify(creds));
  } else {
    sessionStorage.removeItem(adminCredsStorageKey);
  }
}

function createAdminClient(creds) {
  const headers = creds
    ? {
        "x-admin-username": creds.username,
        "x-admin-password": creds.password,
      }
    : {};

  return supabaseLib.createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    global: { headers },
  });
}

function setAdminStatus(message, isError = false) {
  if (!adminStatus) {
    return;
  }

  adminStatus.hidden = false;
  adminStatus.textContent = message;
  adminStatus.dataset.error = isError ? "true" : "false";
}

function setLoginStatus(message, isError = false) {
  if (!adminLoginStatus) {
    return;
  }

  adminLoginStatus.hidden = false;
  adminLoginStatus.textContent = message;
  adminLoginStatus.dataset.error = isError ? "true" : "false";
}

function hideStatuses() {
  if (adminStatus) {
    adminStatus.hidden = true;
  }

  if (adminLoginStatus) {
    adminLoginStatus.hidden = true;
  }
}

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "net";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function applyHero(hero) {
  currentHero = {
    kicker: hero?.kicker || defaultHero.kicker,
    title: hero?.title || defaultHero.title,
    copy: hero?.copy || defaultHero.copy,
    button: hero?.button || defaultHero.button,
  };

  if (heroKickerEl) {
    heroKickerEl.textContent = currentHero.kicker;
  }

  if (heroTitleEl) {
    heroTitleEl.textContent = currentHero.title;
  }

  if (heroCopyEl) {
    heroCopyEl.textContent = currentHero.copy;
  }

  if (heroButtonEl) {
    heroButtonEl.textContent = currentHero.button;
  }

  if (heroKickerInput) {
    heroKickerInput.value = currentHero.kicker;
  }

  if (heroTitleInput) {
    heroTitleInput.value = currentHero.title;
  }

  if (heroCopyInput) {
    heroCopyInput.value = currentHero.copy;
  }

  if (heroButtonInput) {
    heroButtonInput.value = currentHero.button;
  }
}

function renderComments(list, comments, isAdmin = false) {
  list.innerHTML = "";

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = isAdmin ? "admin-empty" : "comments-empty";
    empty.textContent = isAdmin
      ? "Nog geen comments om te beheren."
      : "Nog geen comments. Trap jij hem af.";
    list.append(empty);
    return;
  }

  comments.forEach((comment) => {
    const item = document.createElement("article");
    item.className = isAdmin ? "admin-comment-card" : "comment-item";

    const meta = document.createElement("div");
    meta.className = isAdmin ? "admin-inline-head" : "comment-meta";

    const author = document.createElement("strong");
    author.className = isAdmin ? "admin-comment-author" : "comment-author";
    author.textContent = comment.author || "anoniem";

    const time = document.createElement("span");
    time.className = isAdmin ? "admin-comment-time" : "comment-time";
    time.textContent = formatTime(comment.created_at);

    meta.append(author, time);

    const body = document.createElement("p");
    body.className = isAdmin ? "admin-comment-body" : "comment-body";
    body.textContent = comment.body;

    item.append(meta, body);

    if (isAdmin) {
      const extra = document.createElement("div");
      extra.className = "admin-comment-extra";
      extra.textContent = comment.photo_id;

      const deleteButton = document.createElement("button");
      deleteButton.className = "admin-button danger small";
      deleteButton.type = "button";
      deleteButton.textContent = "Verwijderen";
      deleteButton.addEventListener("click", async () => {
        await deleteComment(comment.id);
      });

      item.append(extra, deleteButton);
    }

    list.append(item);
  });
}

async function loadComments(commentId, list, status) {
  status.hidden = true;
  status.textContent = "";

  const { data, error } = await publicClient
    .from(supabaseConfig.commentsTable)
    .select("id, author, body, created_at")
    .eq("photo_id", commentId)
    .order("created_at", { ascending: false });

  if (error) {
    status.hidden = false;
    status.textContent = "Comments laden lukte even niet.";
    return;
  }

  renderComments(list, data || []);
}

async function submitComment(commentId, nameInput, textInput, list, status, form, counter) {
  const nameValue = nameInput.value.trim();
  const textValue = textInput.value.trim();
  const words = countWords(textValue);

  if (!textValue) {
    status.hidden = false;
    status.textContent = "Typ eerst even een comment.";
    return;
  }

  if (words > 50) {
    status.hidden = false;
    status.textContent = "Hou het bij maximaal 50 woorden.";
    return;
  }

  form.classList.add("is-submitting");
  status.hidden = false;
  status.textContent = "Bezig met posten...";

  const { error } = await publicClient.from(supabaseConfig.commentsTable).insert({
    photo_id: commentId,
    author: nameValue || "anoniem",
    body: textValue,
  });

  form.classList.remove("is-submitting");

  if (error) {
    status.textContent = "Posten lukte even niet.";
    return;
  }

  nameInput.value = "";
  textInput.value = "";
  counter.textContent = "0 / 50 woorden";
  counter.dataset.over = "false";
  status.textContent = "Comment geplaatst.";
  await loadComments(commentId, list, status);
}

function createCommentSection(photo) {
  const comments = document.createElement("details");
  comments.className = "comments-panel";

  const summary = document.createElement("summary");
  summary.className = "comments-toggle";
  summary.textContent = "Reacties openen";

  const body = document.createElement("div");
  body.className = "comments-body";

  const rules = document.createElement("p");
  rules.className = "comments-rules";
  rules.textContent = "Geen login nodig. Maximaal 50 woorden per comment.";

  const form = document.createElement("form");
  form.className = "comment-form";

  const nameInput = document.createElement("input");
  nameInput.className = "comment-input";
  nameInput.type = "text";
  nameInput.maxLength = 32;
  nameInput.placeholder = "Naam (optioneel)";

  const textInput = document.createElement("textarea");
  textInput.className = "comment-textarea";
  textInput.rows = 3;
  textInput.maxLength = 320;
  textInput.placeholder = "Zet hier je comment neer";

  const formFooter = document.createElement("div");
  formFooter.className = "comment-form-footer";

  const counter = document.createElement("span");
  counter.className = "comment-counter";
  counter.dataset.over = "false";
  counter.textContent = "0 / 50 woorden";

  const submitButton = document.createElement("button");
  submitButton.className = "comment-submit";
  submitButton.type = "submit";
  submitButton.textContent = "Plaatsen";

  const status = document.createElement("p");
  status.className = "comments-status";
  status.hidden = true;

  const list = document.createElement("div");
  list.className = "comments-list";

  formFooter.append(counter, submitButton);
  form.append(nameInput, textInput, formFooter);

  textInput.addEventListener("input", () => {
    const words = countWords(textInput.value);
    counter.textContent = `${words} / 50 woorden`;
    counter.dataset.over = words > 50 ? "true" : "false";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitComment(photo.comment_id, nameInput, textInput, list, status, form, counter);
  });

  comments.addEventListener("toggle", async () => {
    if (!comments.open || comments.dataset.loaded === "true") {
      return;
    }

    await loadComments(photo.comment_id, list, status);
    comments.dataset.loaded = "true";
  });

  body.append(rules, form, status, list);
  comments.append(summary, body);
  return comments;
}

function renderFeed() {
  if (!photoFeed) {
    return;
  }

  photoFeed.innerHTML = "";

  currentPhotos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";

    const top = document.createElement("div");
    top.className = "card-topline";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = photo.tag;

    const counter = document.createElement("span");
    counter.className = "counter";
    counter.textContent = String(index + 1).padStart(2, "0");

    top.append(tag, counter);

    const photoWrap = document.createElement("div");
    photoWrap.className = "photo-wrap";

    const image = document.createElement("img");
    image.src = photo.image;
    image.alt = photo.title;
    photoWrap.append(image);

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = photo.title;

    const copy = document.createElement("p");
    copy.className = "card-copy";
    copy.textContent = photo.copy;

    const note = document.createElement("div");
    note.className = "card-note";
    note.textContent = photo.note;

    card.append(top, photoWrap, title, copy, note, createCommentSection(photo));
    photoFeed.append(card);
  });
}

async function loadHeroFromSupabase() {
  const { data } = await publicClient
    .from(supabaseConfig.settingsTable)
    .select("value")
    .eq("key", "hero")
    .maybeSingle();

  applyHero(data?.value || defaultHero);
}

async function loadPhotosFromSupabase() {
  const { data } = await publicClient
    .from(supabaseConfig.photosTable)
    .select("id, display_order, tag, title, copy, note, image, comment_id, active")
    .eq("active", true)
    .order("display_order", { ascending: true });

  currentPhotos =
    data && data.length
      ? data
      : defaultMemories.map((memory) => ({ ...memory }));

  renderFeed();
}

async function registerVisit() {
  const sessionKey = "vakantie_visit_sent_v2";

  if (sessionStorage.getItem(sessionKey)) {
    return;
  }

  sessionStorage.setItem(sessionKey, "1");

  await publicClient.from(supabaseConfig.visitsTable).insert({
    session_id: crypto.randomUUID(),
    path: window.location.pathname,
  });
}

async function deleteComment(id) {
  const { error } = await adminClient
    .from(supabaseConfig.commentsTable)
    .delete()
    .eq("id", id);

  if (error) {
    setAdminStatus("Comment verwijderen lukte niet.", true);
    return;
  }

  setAdminStatus("Comment verwijderd.");
  await loadAdminData();
}

async function saveHero() {
  const payload = {
    kicker: heroKickerInput.value.trim() || defaultHero.kicker,
    title: heroTitleInput.value.trim() || defaultHero.title,
    copy: heroCopyInput.value.trim() || defaultHero.copy,
    button: heroButtonInput.value.trim() || defaultHero.button,
  };

  const { error } = await adminClient
    .from(supabaseConfig.settingsTable)
    .upsert({ key: "hero", value: payload }, { onConflict: "key" });

  if (error) {
    setAdminStatus("Hero opslaan lukte niet.", true);
    return;
  }

  applyHero(payload);
  setAdminStatus("Hero opgeslagen.");
}

async function addPhoto() {
  const displayOrder = Number(photoOrderInput.value);

  const payload = {
    display_order: Number.isFinite(displayOrder) ? displayOrder : currentPhotos.length + 1,
    tag: photoTagInput.value.trim() || "00:00",
    title: photoTitleInput.value.trim() || "Nieuwe foto",
    copy: photoCopyInput.value.trim() || "",
    note: photoNoteInput.value.trim() || "",
    image: photoImageInput.value.trim(),
    comment_id: photoCommentIdInput.value.trim() || `foto-${crypto.randomUUID().slice(0, 8)}`,
    active: true,
  };

  if (!payload.image) {
    setAdminStatus("Vul eerst een afbeelding URL of assetpad in.", true);
    return;
  }

  const { error } = await adminClient.from(supabaseConfig.photosTable).insert(payload);

  if (error) {
    setAdminStatus("Foto toevoegen lukte niet.", true);
    return;
  }

  photoTagInput.value = "";
  photoOrderInput.value = "";
  photoTitleInput.value = "";
  photoCommentIdInput.value = "";
  photoCopyInput.value = "";
  photoNoteInput.value = "";
  photoImageInput.value = "";

  setAdminStatus("Foto toegevoegd.");
  await loadAdminData();
}

function renderAdminPhotos() {
  if (!adminPhotoList) {
    return;
  }

  adminPhotoList.innerHTML = "";

  if (!currentPhotos.length) {
    const empty = document.createElement("p");
    empty.className = "admin-empty";
    empty.textContent = "Nog geen foto's om te beheren.";
    adminPhotoList.append(empty);
    return;
  }

  currentPhotos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "admin-photo-card";

    card.innerHTML = `
      <div class="admin-form two-col">
        <input class="admin-input" data-field="tag" value="${escapeHtml(photo.tag)}" />
        <input class="admin-input" data-field="display_order" type="number" value="${escapeHtml(photo.display_order)}" />
        <input class="admin-input" data-field="title" value="${escapeHtml(photo.title)}" />
        <input class="admin-input" data-field="comment_id" value="${escapeHtml(photo.comment_id)}" />
        <textarea class="admin-textarea" data-field="copy" rows="3">${escapeHtml(photo.copy)}</textarea>
        <textarea class="admin-textarea" data-field="note" rows="3">${escapeHtml(photo.note)}</textarea>
        <input class="admin-input full" data-field="image" value="${escapeHtml(photo.image)}" />
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-card-actions";

    const saveButton = document.createElement("button");
    saveButton.className = "admin-button secondary small";
    saveButton.type = "button";
    saveButton.textContent = "Opslaan";
    saveButton.addEventListener("click", async () => {
      const next = {
        tag: card.querySelector('[data-field="tag"]').value.trim(),
        display_order:
          Number(card.querySelector('[data-field="display_order"]').value) || photo.display_order,
        title: card.querySelector('[data-field="title"]').value.trim(),
        comment_id: card.querySelector('[data-field="comment_id"]').value.trim(),
        copy: card.querySelector('[data-field="copy"]').value.trim(),
        note: card.querySelector('[data-field="note"]').value.trim(),
        image: card.querySelector('[data-field="image"]').value.trim(),
      };

      const { error } = await adminClient
        .from(supabaseConfig.photosTable)
        .update(next)
        .eq("id", photo.id);

      if (error) {
        setAdminStatus("Foto opslaan lukte niet.", true);
        return;
      }

      setAdminStatus("Foto opgeslagen.");
      await loadAdminData();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "admin-button danger small";
    deleteButton.type = "button";
    deleteButton.textContent = "Verwijderen";
    deleteButton.addEventListener("click", async () => {
      const { error } = await adminClient
        .from(supabaseConfig.photosTable)
        .update({ active: false })
        .eq("id", photo.id);

      if (error) {
        setAdminStatus("Foto verwijderen lukte niet.", true);
        return;
      }

      setAdminStatus("Foto verwijderd.");
      await loadAdminData();
    });

    actions.append(saveButton, deleteButton);
    card.append(actions);
    adminPhotoList.append(card);
  });
}

async function loadAdminData() {
  const [{ count: visitCount, error: visitError }, { count: commentsCount, error: commentsError }, { count: photosCount, error: photosError }, commentsResult] =
    await Promise.all([
      adminClient
        .from(supabaseConfig.visitsTable)
        .select("*", { count: "exact", head: true }),
      adminClient
        .from(supabaseConfig.commentsTable)
        .select("*", { count: "exact", head: true }),
      adminClient
        .from(supabaseConfig.photosTable)
        .select("*", { count: "exact", head: true })
        .eq("active", true),
      adminClient
        .from(supabaseConfig.commentsTable)
        .select("id, photo_id, author, body, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  if (visitError || commentsError || photosError || commentsResult.error) {
    throw new Error("admin data laden mislukt");
  }

  if (visitCountEl) {
    visitCountEl.textContent = String(visitCount || 0);
  }

  if (commentCountEl) {
    commentCountEl.textContent = String(commentsCount || 0);
  }

  if (photoCountEl) {
    photoCountEl.textContent = String(photosCount || 0);
  }

  await loadHeroFromSupabase();
  await loadPhotosFromSupabase();
  renderAdminPhotos();
  renderComments(adminCommentList, commentsResult.data || [], true);
}

async function loginAdmin(username, password) {
  hideStatuses();

  if (!username || !password) {
    setLoginStatus("Vul gebruikersnaam en wachtwoord in.", true);
    return;
  }

  writeAdminCreds({ username, password });

  try {
    await loadAdminData();
    adminLoginCard.hidden = true;
    adminDashboard.hidden = false;
    setAdminStatus("Admin ingelogd.");
  } catch {
    writeAdminCreds(null);
    setLoginStatus("Login lukte niet.", true);
  }
}

function logoutAdmin() {
  writeAdminCreds(null);
  adminDashboard.hidden = true;
  adminLoginCard.hidden = false;
  hideStatuses();
}

async function bootstrapPublicPage() {
  applyHero(defaultHero);
  renderFeed();
  await Promise.all([loadHeroFromSupabase(), loadPhotosFromSupabase(), registerVisit()]);
}

async function bootstrapAdminPage() {
  applyHero(defaultHero);

  if (adminCreds) {
    try {
      adminLoginCard.hidden = true;
      adminDashboard.hidden = false;
      await loadAdminData();
      return;
    } catch {
      writeAdminCreds(null);
      adminDashboard.hidden = true;
      adminLoginCard.hidden = false;
      setLoginStatus("Log opnieuw in.", true);
    }
  }
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loginAdmin(
      document.querySelector("#adminUsername").value.trim(),
      document.querySelector("#adminPassword").value
    );
  });
}

if (saveHeroButton) {
  saveHeroButton.addEventListener("click", saveHero);
}

if (addPhotoButton) {
  addPhotoButton.addEventListener("click", addPhoto);
}

if (refreshAdminButton) {
  refreshAdminButton.addEventListener("click", async () => {
    try {
      await loadAdminData();
      setAdminStatus("Admin ververst.");
    } catch {
      setAdminStatus("Verversen lukte niet.", true);
    }
  });
}

if (logoutAdminButton) {
  logoutAdminButton.addEventListener("click", logoutAdmin);
}

if (pageMode === "admin") {
  bootstrapAdminPage();
} else {
  bootstrapPublicPage();
}
