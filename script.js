const photoFeed = document.querySelector("#photoFeed");

const commentsConfig = {
  repo: "TimvanOene01/Vakantie-thijn",
  repoId: "R_kgDOTLn0dw",
  category: "General",
  categoryId: "DIC_kwDOTLn0d84DAbZz",
  mapping: "specific",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "dark_dimmed",
  lang: "nl",
  loading: "lazy",
};

const memories = [
  {
    tag: "02:17",
    title: "Er zijn foto's waar je geen uitleg bij wilt geven en dit is er een van",
    copy: "Je opent de pagina, scrollt omlaag en dan krijg je dit gewoon vol in beeld. Precies de juiste energie.",
    note: "Deze staat nu op plek 1.",
    image: "assets/chatgpt-image-2026-07-02-191533.png",
    hideDetail: true,
    commentId: "foto-1",
  },
  {
    tag: "13:10",
    title: "Nieuwe afbeelding op plek 2, subtiel was blijkbaar geen optie",
    copy: "Je scrolt nog geen twee seconden en dan staat dit er al pontificaal tussen.",
    note: "Afbeelding 2 is nu vervangen door je nieuwe versie.",
    image: "assets/image-2-replacement.png",
    hideDetail: true,
    commentId: "foto-2",
  },
  {
    tag: "16:28",
    title: "Plek 3 is nu vervangen door pure vakantiechaos",
    copy: "Je hoeft hier eigenlijk niets meer aan uit te leggen, de foto doet het zware werk zelf al.",
    note: "De oude derde afbeelding is vervangen door je nieuwe foto.",
    image: "assets/image-3-replacement.png",
    hideDetail: true,
    commentId: "foto-3",
  },
  {
    tag: "19:54",
    title: "Plek 4 is nu vervangen door complete meme-ellende",
    copy: "Dit is precies zo'n foto die je niet uitlegt maar gewoon laat staan voor maximaal effect.",
    note: "De oude vierde afbeelding is vervangen door je nieuwe versie.",
    image: "assets/image-4-replacement.png",
    hideDetail: true,
    commentId: "foto-4",
  },
  {
    tag: "23:43",
    title: "Plek 5 is nu vervangen door nog meer cursed energie",
    copy: "Je denkt dat het niet gekker wordt en dan scroll je precies hiernaartoe.",
    note: "Alleen plek 5 is aangepast zoals je vroeg.",
    image: "assets/image-5-replacement.png",
    hideDetail: true,
    commentId: "foto-5",
  },
  {
    tag: "08:11",
    title: "Zijaanzicht met exact nul reden om dit prive te houden",
    copy: "Dit is gewoon zo'n foto die schreeuwt om onderaan een zwarte roast-scroll te eindigen.",
    note: "Nieuwe echte foto toegevoegd als slotstuk.",
    image: "assets/IMG_4568.JPG",
    hideDetail: true,
    commentId: "foto-6",
  },
  {
    tag: "11:47",
    title: "Nog een groepsfoto die totaal geen context nodig heeft",
    copy: "Dit is precies het type beeld dat steeds erger wordt naarmate je er langer naar kijkt.",
    note: "Nieuw toegevoegd als extra kaart onderaan de feed.",
    image: "assets/image-7-added.png",
    hideDetail: true,
    commentId: "foto-7",
  },
];

function isCommentsReady() {
  return Boolean(commentsConfig.repoId && commentsConfig.categoryId);
}

function createGiscusWidget(container, memory) {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-repo", commentsConfig.repo);
  script.setAttribute("data-repo-id", commentsConfig.repoId);
  script.setAttribute("data-category", commentsConfig.category);
  script.setAttribute("data-category-id", commentsConfig.categoryId);
  script.setAttribute("data-mapping", commentsConfig.mapping);
  script.setAttribute("data-term", memory.commentId);
  script.setAttribute("data-strict", "1");
  script.setAttribute("data-reactions-enabled", commentsConfig.reactionsEnabled);
  script.setAttribute("data-emit-metadata", commentsConfig.emitMetadata);
  script.setAttribute("data-input-position", commentsConfig.inputPosition);
  script.setAttribute("data-theme", commentsConfig.theme);
  script.setAttribute("data-lang", commentsConfig.lang);
  script.setAttribute("data-loading", commentsConfig.loading);

  container.innerHTML = "";
  container.append(script);
}

function attachCommentToggle(details, container, memory) {
  details.addEventListener("toggle", () => {
    if (!details.open || container.dataset.loaded === "true") {
      return;
    }

    if (!isCommentsReady()) {
      container.innerHTML =
        '<p class="comments-help">Comments staan klaar in de site, maar GitHub Discussions moet nog heel even gekoppeld worden.</p>';
      container.dataset.loaded = "true";
      return;
    }

    createGiscusWidget(container, memory);
    container.dataset.loaded = "true";
  });
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

    const comments = document.createElement("details");
    comments.className = "comments-panel";

    const summary = document.createElement("summary");
    summary.className = "comments-toggle";
    summary.textContent = "Reacties openen";

    const commentsBody = document.createElement("div");
    commentsBody.className = "comments-body";

    comments.append(summary, commentsBody);
    attachCommentToggle(comments, commentsBody, memory);

    card.append(top, photoWrap, title, copy, note, comments);
    photoFeed.append(card);
  });
}

renderFeed();
