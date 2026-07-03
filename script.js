const photoFeed = document.querySelector("#photoFeed");

const supabaseConfig = {
  url: "https://lardnnecoesiazbjwilp.supabase.co",
  anonKey: "sb_publishable_FNqzAtTU_0Q7Nzp44CV5-w_Me1xOQ85",
  table: "photo_comments",
};

const memories = [
  {
    tag: "02:17",
    title: "Er zijn foto's waar je geen uitleg bij wilt geven en dit is er een van",
    copy: "Je opent de pagina, scrollt omlaag en dan krijg je dit gewoon vol in beeld. Precies de juiste energie.",
    note: "Deze staat nu op plek 1.",
    image: "assets/chatgpt-image-2026-07-02-191533.png",
    commentId: "foto-1",
  },
  {
    tag: "13:10",
    title: "Nieuwe afbeelding op plek 2, subtiel was blijkbaar geen optie",
    copy: "Je scrolt nog geen twee seconden en dan staat dit er al pontificaal tussen.",
    note: "Afbeelding 2 is nu vervangen door je nieuwe versie.",
    image: "assets/image-2-replacement.png",
    commentId: "foto-2",
  },
  {
    tag: "16:28",
    title: "Plek 3 is nu vervangen door pure vakantiechaos",
    copy: "Je hoeft hier eigenlijk niets meer aan uit te leggen, de foto doet het zware werk zelf al.",
    note: "De oude derde afbeelding is vervangen door je nieuwe foto.",
    image: "assets/image-3-replacement.png",
    commentId: "foto-3",
  },
  {
    tag: "19:54",
    title: "Plek 4 is nu vervangen door complete meme-ellende",
    copy: "Dit is precies zo'n foto die je niet uitlegt maar gewoon laat staan voor maximaal effect.",
    note: "De oude vierde afbeelding is vervangen door je nieuwe versie.",
    image: "assets/image-4-replacement.png",
    commentId: "foto-4",
  },
  {
    tag: "23:43",
    title: "Plek 5 is nu vervangen door nog meer cursed energie",
    copy: "Je denkt dat het niet gekker wordt en dan scroll je precies hiernaartoe.",
    note: "Alleen plek 5 is aangepast zoals je vroeg.",
    image: "assets/image-5-replacement.png",
    commentId: "foto-5",
  },
  {
    tag: "08:11",
    title: "Zijaanzicht met exact nul reden om dit prive te houden",
    copy: "Dit is gewoon zo'n foto die schreeuwt om onderaan een zwarte roast-scroll te eindigen.",
    note: "Nieuwe echte foto toegevoegd als slotstuk.",
    image: "assets/IMG_4568.JPG",
    commentId: "foto-6",
  },
  {
    tag: "11:47",
    title: "Nog een groepsfoto die totaal geen context nodig heeft",
    copy: "Dit is precies het type beeld dat steeds erger wordt naarmate je er langer naar kijkt.",
    note: "Nieuw toegevoegd als extra kaart onderaan de feed.",
    image: "assets/image-7-added.png",
    commentId: "foto-7",
  },
];

const supabaseReady = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
const supabaseClient = supabaseReady
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

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

function createHelpMessage() {
  const help = document.createElement("p");
  help.className = "comments-help";
  help.textContent =
    "Comments staan klaar, maar ik moet nog even jouw Supabase URL en anon key invullen.";

  return help;
}

function createStatusLine() {
  const status = document.createElement("p");
  status.className = "comments-status";
  status.hidden = true;
  return status;
}

function renderComments(list, comments) {
  list.innerHTML = "";

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "comments-empty";
    empty.textContent = "Nog geen comments. Trap jij hem af.";
    list.append(empty);
    return;
  }

  comments.forEach((comment) => {
    const item = document.createElement("article");
    item.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";

    const author = document.createElement("strong");
    author.className = "comment-author";
    author.textContent = comment.author || "anoniem";

    const time = document.createElement("span");
    time.className = "comment-time";
    time.textContent = formatTime(comment.created_at);

    meta.append(author, time);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = comment.body;

    item.append(meta, body);
    list.append(item);
  });
}

async function loadComments(memory, list, status) {
  status.hidden = true;
  status.textContent = "";

  const { data, error } = await supabaseClient
    .from(supabaseConfig.table)
    .select("id, author, body, created_at")
    .eq("photo_id", memory.commentId)
    .order("created_at", { ascending: false });

  if (error) {
    status.hidden = false;
    status.textContent = "Comments laden lukte even niet.";
    return;
  }

  renderComments(list, data || []);
}

async function submitComment(memory, nameInput, textInput, list, status, form, counter) {
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

  const payload = {
    photo_id: memory.commentId,
    author: nameValue || "anoniem",
    body: textValue,
  };

  const { error } = await supabaseClient.from(supabaseConfig.table).insert(payload);

  form.classList.remove("is-submitting");

  if (error) {
    status.textContent = "Posten lukte even niet.";
    return;
  }

  nameInput.value = "";
  textInput.value = "";
  counter.textContent = "0 / 50 woorden";
  status.textContent = "Comment geplaatst.";
  await loadComments(memory, list, status);
}

function createCommentSection(memory) {
  const comments = document.createElement("details");
  comments.className = "comments-panel";

  const summary = document.createElement("summary");
  summary.className = "comments-toggle";
  summary.textContent = "Reacties openen";

  const body = document.createElement("div");
  body.className = "comments-body";

  comments.append(summary, body);

  if (!supabaseReady) {
    body.append(createHelpMessage());
    return comments;
  }

  const rules = document.createElement("p");
  rules.className = "comments-rules";
  rules.textContent = "Geen login nodig. Maximaal 50 woorden per comment.";

  const form = document.createElement("form");
  form.className = "comment-form";

  const nameInput = document.createElement("input");
  nameInput.className = "comment-input";
  nameInput.type = "text";
  nameInput.name = `name-${memory.commentId}`;
  nameInput.maxLength = 32;
  nameInput.placeholder = "Naam (optioneel)";

  const textInput = document.createElement("textarea");
  textInput.className = "comment-textarea";
  textInput.name = `comment-${memory.commentId}`;
  textInput.rows = 3;
  textInput.maxLength = 320;
  textInput.placeholder = "Zet hier je comment neer";

  const formFooter = document.createElement("div");
  formFooter.className = "comment-form-footer";

  const counter = document.createElement("span");
  counter.className = "comment-counter";
  counter.textContent = "0 / 50 woorden";

  const submitButton = document.createElement("button");
  submitButton.className = "comment-submit";
  submitButton.type = "submit";
  submitButton.textContent = "Plaatsen";

  formFooter.append(counter, submitButton);
  form.append(nameInput, textInput, formFooter);

  const status = createStatusLine();

  const list = document.createElement("div");
  list.className = "comments-list";

  textInput.addEventListener("input", () => {
    const words = countWords(textInput.value);
    counter.textContent = `${words} / 50 woorden`;
    counter.dataset.over = words > 50 ? "true" : "false";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitComment(memory, nameInput, textInput, list, status, form, counter);
  });

  comments.addEventListener("toggle", async () => {
    if (!comments.open || comments.dataset.loaded === "true") {
      return;
    }

    await loadComments(memory, list, status);
    comments.dataset.loaded = "true";
  });

  body.append(rules, form, status, list);
  return comments;
}

function renderFeed() {
  photoFeed.innerHTML = "";

  memories.forEach((memory, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";

    const top = document.createElement("div");
    top.className = "card-topline";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = memory.tag;

    const counter = document.createElement("span");
    counter.className = "counter";
    counter.textContent = String(index + 1).padStart(2, "0");

    top.append(tag, counter);

    const photoWrap = document.createElement("div");
    photoWrap.className = "photo-wrap";

    const image = document.createElement("img");
    image.src = memory.image;
    image.alt = memory.title;
    photoWrap.append(image);

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = memory.title;

    const copy = document.createElement("p");
    copy.className = "card-copy";
    copy.textContent = memory.copy;

    const note = document.createElement("div");
    note.className = "card-note";
    note.textContent = memory.note;

    const comments = createCommentSection(memory);

    card.append(top, photoWrap, title, copy, note, comments);
    photoFeed.append(card);
  });
}

renderFeed();
