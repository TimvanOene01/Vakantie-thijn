const photoFeed = document.querySelector("#photoFeed");

const memories = [
  {
    tag: "02:17",
    title: "Er zijn foto's waar je geen uitleg bij wilt geven en dit is er een van",
    copy: "Je opent de pagina, scrollt omlaag en dan krijg je dit gewoon vol in beeld. Precies de juiste energie.",
    note: "Deze staat nu op plek 1.",
    image: "assets/chatgpt-image-2026-07-02-191533.png",
    hideDetail: true,
  },
  {
    tag: "13:10",
    title: "Schuimsnor, half oog dicht, volledig overtuigd van zichzelf",
    copy: "Alsof iemand per ongeluk charisma probeerde te combineren met pure onzin en toen dit kreeg.",
    note: "Tweede echte foto nu zonder bier in beeld.",
    image: "assets/IMG_4463_no_beer.png",
    hideDetail: true,
  },
  {
    tag: "16:28",
    title: "Alsof iemand zei doe eens normaal en hij het tegenovergestelde koos",
    copy: "Perfecte vakantiefoto als je doel is om voor altijd chantagemateriaal te bewaren.",
    note: "Derde echte foto toegevoegd, nog steeds zonder crop.",
    image: "assets/IMG_4461.PNG",
    hideDetail: true,
  },
  {
    tag: "19:54",
    title: "Thijn kijkt alsof hij net iets heel raars heeft gehoord",
    copy: "Exact het soort foto dat je als openingsklap op een QR-site wilt hebben.",
    note: "De oude eerste foto staat nu op plek 4.",
    image: "assets/IMG_4462.PNG",
    hideDetail: true,
  },
  {
    tag: "23:43",
    title: "Hier begon het niveau officieel zorgwekkend te worden",
    copy: "Een beeld waar je vijf seconden naar kijkt en meteen denkt: ja dit moet online.",
    note: "Zet hier gewoon je meest diabolische caption onder, maar houd het niet-expliciet.",
    image: "assets/IMG_4569.JPG",
    hideDetail: true,
  },
  {
    tag: "08:11",
    title: "Zijaanzicht met exact nul reden om dit prive te houden",
    copy: "Dit is gewoon zo'n foto die schreeuwt om onderaan een zwarte roast-scroll te eindigen.",
    note: "Nieuwe echte foto toegevoegd als slotstuk.",
    image: "assets/IMG_4568.JPG",
    hideDetail: true,
  },
];

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

    card.append(top, photoWrap, title, copy, note);
    photoFeed.append(card);
  });
}

renderFeed();
