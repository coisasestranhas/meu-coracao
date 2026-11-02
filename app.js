const loginScreen = document.querySelector("[data-login-screen]");
const appContent = document.querySelector("[data-app-content]");
const publicApp = document.querySelector("[data-public-app]");
const legacyContent = document.querySelector("[data-legacy-content]");
const enterAppButton = document.querySelector("[data-enter-app]");

enterAppButton.addEventListener("click", () => {
  loginScreen.hidden = true;
  appContent.hidden = false;
  publicApp.hidden = false;
});

const navButtons = [...document.querySelectorAll("[data-view]")];
const publicTabs = [...document.querySelectorAll("[data-public-tab]")];
const publicHome = document.querySelector("[data-public-home]");
const publicFeelings = document.querySelector("[data-public-feelings]");
const publicLayout = document.querySelector(".public-layout");
const publicSidebar = document.querySelector(".public-sidebar");
const publicQuotes = document.querySelector(".public-quotes");
const publicForYouStage = document.querySelector('[data-stage="for-you"]');
const publicForYouDayPanel = document.querySelector('[data-side="for-you"]');
publicLayout.append(publicForYouStage);
publicSidebar.append(publicForYouDayPanel);
const musicSlides = [...document.querySelectorAll("[data-music-slide]")];
const musicPageButtons = [...document.querySelectorAll("[data-music-page]")];
const musicNextButton = document.querySelector("[data-music-next]");
const openLegacyButton = document.querySelector("[data-open-legacy]");
const returnPublicButton = document.querySelector("[data-return-public]");
const legacyLayout = document.querySelector("[data-legacy-content] .layout");
const stages = [...document.querySelectorAll("[data-stage]")];
const sidePanels = [...document.querySelectorAll("[data-side]")];
const aboutStage = document.querySelector('[data-stage="about"]');
const letterPages = [...aboutStage.querySelectorAll(".letter-page")];
const letterPageButtons = [...document.querySelectorAll("[data-letter-page]")];
const forYouPages = [...document.querySelectorAll("[data-for-you-page]")];
const forYouPageButtons = [...document.querySelectorAll("[data-for-you-dot]")];
const letterCarouselToggle = document.querySelector(
  "[data-letter-carousel-toggle]",
);
const letterPauseIcon = document.querySelector("[data-letter-pause-icon]");
const letterPlayIcon = document.querySelector("[data-letter-play-icon]");
const feelingsHeart = document.querySelector("[data-feelings-heart]");
const feelingsCheck = document.querySelector("[data-feelings-check]");
const feelingsDialog = document.querySelector(".feelings-dialog");
const feelingOptions = document.querySelector(".feeling-options");
const feelingResponse = document.querySelector(".feeling-response");
const feelingResponseTitle = feelingResponse.querySelector("h3");
const feelingResponseText = feelingResponse.querySelector("p");
const dailyLovePhrase = document.querySelector(".daily-love-phrase");
const dailyLoveLanguage = document.querySelector(".daily-love-language");
const dailyLovePhraseText = document.querySelector(".daily-love-phrase-text");
const testModeBadge = document.querySelector(".test-mode-badge");
const isTestMode =
  new URLSearchParams(window.location.search).get("teste") === "1";
const calendarGrids = [...document.querySelectorAll(".calendar-grid")];
const calendarMessages = [...document.querySelectorAll(".calendar-message")];
const monthLabels = [...document.querySelectorAll(".calendar-month-label")];
const dailyLovePhrases = [
  { language: "Inglês", phrase: "I love you" },
  { language: "Coreano", phrase: "사랑해" },
  { language: "Russo", phrase: "Я тебя люблю" },
  { language: "Espanhol", phrase: "Te amo" },
  { language: "Francês", phrase: "Je t’aime" },
  { language: "Italiano", phrase: "Ti amo" },
  { language: "Japonês", phrase: "愛してる" },
  { language: "Alemão", phrase: "Ich liebe dich" },
  { language: "Turco", phrase: "Seni seviyorum" },
  { language: "Chinês (mandarim)", phrase: "我爱你" },
];
const dailyLovePhraseStart = Date.UTC(2026, 9, 5);

testModeBadge.hidden = !isTestMode;

let letterCarouselTimer;
let letterCarouselPaused = false;
let currentForYouPage = 0;
let forYouCarouselTimer;

function showForYouPage(index) {
  currentForYouPage = (index + forYouPages.length) % forYouPages.length;
  forYouPages.forEach((page, pageIndex) => {
    page.hidden = pageIndex !== currentForYouPage;
  });
  forYouPageButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === currentForYouPage;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function stopForYouCarousel() {
  window.clearInterval(forYouCarouselTimer);
  forYouCarouselTimer = undefined;
}

function startForYouCarousel() {
  stopForYouCarousel();
  if (
    forYouPages.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  forYouCarouselTimer = window.setInterval(() => {
    if (document.hidden || publicForYouStage.hidden) return;
    showForYouPage(currentForYouPage + 1);
  }, 3000);
}

function showView(view) {
  const targetView = view === "letters" ? "about" : view;
  const targetSide = view === "lyrics" ? "lyrics" : targetView;
  const usesSidebarLayout = view === "letters" || view === "lyrics";
  legacyLayout.classList.toggle("is-letter-view", usesSidebarLayout);
  legacyLayout.classList.toggle("is-lyrics-view", view === "lyrics");

  stages.forEach((stage) => {
    const visible = stage.dataset.stage === targetView;
    stage.hidden = !visible;
    stage.classList.toggle("is-visible", visible);
  });

  sidePanels.forEach((panel) => {
    panel.classList.toggle("is-visible", panel.dataset.side === targetSide);
  });

  navButtons.forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (view !== "for-you") stopForYouCarousel();

  if (view === "letters") {
    startLetterCarousel();
    document
      .querySelector(".about-stage .letter-page")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    stopLetterCarousel();
    if (view === "lyrics") {
      document
        .querySelector(".lyrics-page")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (view === "for-you") {
      showForYouPage(currentForYouPage);
      startForYouCarousel();
      document
        .querySelector(".for-you-page:not([hidden])")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

forYouPages.forEach((page, index) => {
  page
    .querySelector("[data-for-you-previous]")
    .addEventListener("click", () => {
      showForYouPage(index - 1);
      startForYouCarousel();
    });
  page.querySelector("[data-for-you-next]").addEventListener("click", () => {
    showForYouPage(index + 1);
    startForYouCarousel();
  });
});

forYouPageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showForYouPage(index);
    startForYouCarousel();
  });
});

showForYouPage(0);

function showPublicTab(tab) {
  const showingFeelings = tab === "feelings";
  const showingForYou = tab === "for-you";
  publicHome.hidden = showingFeelings || showingForYou;
  publicFeelings.hidden = !showingFeelings;
  publicForYouStage.hidden = !showingForYou;
  publicQuotes.hidden = showingForYou;
  publicForYouDayPanel.classList.toggle("is-visible", showingForYou);
  publicLayout.classList.toggle("is-for-you-view", showingForYou);
  if (showingForYou) startForYouCarousel();
  else stopForYouCarousel();

  publicTabs.forEach((button) => {
    const active = button.dataset.publicTab === tab;
    button.classList.toggle("is-active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  stopMusicCarousel();
  if (showingFeelings) startMusicCarousel();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

publicTabs.forEach((button) => {
  button.addEventListener("click", () => {
    showPublicTab(button.dataset.publicTab);
  });
});

let musicCarouselTimer;
let currentMusicPage = 0;

function showMusicPage(index) {
  currentMusicPage = index;
  musicSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.hidden = !active;
    slide.classList.toggle("is-active", active);
  });
  musicPageButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function stopMusicCarousel() {
  window.clearInterval(musicCarouselTimer);
  musicCarouselTimer = undefined;
}

function startMusicCarousel() {
  stopMusicCarousel();
  if (
    musicSlides.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  musicCarouselTimer = window.setInterval(() => {
    if (document.hidden || publicFeelings.hidden) return;
    showMusicPage((currentMusicPage + 1) % musicSlides.length);
  }, 3000);
}

musicPageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showMusicPage(index);
    startMusicCarousel();
  });
});

musicNextButton.addEventListener("click", () => {
  showMusicPage((currentMusicPage + 1) % musicSlides.length);
  startMusicCarousel();
});

publicFeelings.addEventListener("mouseenter", stopMusicCarousel);
publicFeelings.addEventListener("mouseleave", () => {
  if (!publicFeelings.hidden) startMusicCarousel();
});
publicFeelings.addEventListener("focusin", stopMusicCarousel);
publicFeelings.addEventListener("focusout", (event) => {
  if (!publicFeelings.contains(event.relatedTarget) && !publicFeelings.hidden) {
    startMusicCarousel();
  }
});

publicFeelings.addEventListener("keydown", (event) => {
  if (!event.target.matches("[data-music-page], [data-music-next]")) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  event.preventDefault();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  showMusicPage(
    (currentMusicPage + direction + musicSlides.length) % musicSlides.length,
  );
  startMusicCarousel();
});

openLegacyButton.addEventListener("click", () => {
  publicApp.hidden = true;
  legacyContent.hidden = false;
  showView("home");
  window.scrollTo({ top: 0 });
});

returnPublicButton.addEventListener("click", () => {
  legacyContent.hidden = true;
  publicApp.hidden = false;
  showPublicTab("home");
});

feelingsHeart.addEventListener("click", () => {
  openFeelingsDialog();
});

function navigateLetter(currentPage, nextPage, button) {
  if (currentPage.dataset.isNavigating === "true") return;

  const finishNavigation = () => {
    button?.classList.remove("is-pressing");
    delete currentPage.dataset.isNavigating;
    currentPage.hidden = true;
    nextPage.hidden = false;
    updateLetterPagination(nextPage);
  };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) {
    finishNavigation();
    return;
  }

  currentPage.dataset.isNavigating = "true";
  button?.classList.add("is-pressing");
  window.setTimeout(() => {
    finishNavigation();
  }, 180);
}

function updateLetterPagination(activePage) {
  const activeIndex = letterPages.indexOf(activePage);
  letterPageButtons.forEach((button, index) => {
    const active = index === activeIndex;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function stopLetterCarousel() {
  window.clearInterval(letterCarouselTimer);
  letterCarouselTimer = undefined;
}

function updateLetterCarouselToggle() {
  const label = letterCarouselPaused
    ? "Retomar avanço automático"
    : "Pausar avanço automático";
  letterCarouselToggle.setAttribute("aria-label", label);
  letterCarouselToggle.setAttribute("title", label);
  letterCarouselToggle.setAttribute(
    "aria-pressed",
    String(letterCarouselPaused),
  );
  letterPauseIcon.hidden = letterCarouselPaused;
  letterPlayIcon.hidden = !letterCarouselPaused;
}

function startLetterCarousel() {
  stopLetterCarousel();
  if (
    letterPages.length < 2 ||
    letterCarouselPaused ||
    aboutStage.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  letterCarouselTimer = window.setInterval(() => {
    if (document.hidden || aboutStage.hidden) return;

    const currentPage = letterPages.find((page) => !page.hidden);
    const currentIndex = letterPages.indexOf(currentPage);
    const nextPage = letterPages[(currentIndex + 1) % letterPages.length];
    navigateLetter(currentPage, nextPage, null);
  }, 3000);
}

letterCarouselToggle.addEventListener("click", () => {
  letterCarouselPaused = !letterCarouselPaused;
  updateLetterCarouselToggle();
  if (letterCarouselPaused) stopLetterCarousel();
  else startLetterCarousel();
});

updateLetterCarouselToggle();

letterPageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const currentPage = letterPages.find((page) => !page.hidden);
    const nextPage = letterPages[index];
    if (currentPage === nextPage) return;
    navigateLetter(currentPage, nextPage, button);
    startLetterCarousel();
  });
});

updateLetterPagination(letterPages[0]);

aboutStage.addEventListener("mouseenter", stopLetterCarousel);
aboutStage.addEventListener("mouseleave", () => {
  if (!aboutStage.hidden) startLetterCarousel();
});
aboutStage.addEventListener("focusin", stopLetterCarousel);
aboutStage.addEventListener("focusout", (event) => {
  if (!aboutStage.contains(event.relatedTarget) && !aboutStage.hidden) {
    startLetterCarousel();
  }
});

letterPages.forEach((letterPage) => {
  const previousButton = letterPage.querySelector(".previous-letter");
  const nextButton = letterPage.querySelector(".next-letter");
  const pageIndex = letterPages.indexOf(letterPage);
  const previousPage = letterPages[pageIndex - 1];
  const nextPage = letterPages[pageIndex + 1];

  previousButton.disabled = !previousPage;
  previousButton.addEventListener("click", () => {
    if (!previousPage) return;
    navigateLetter(letterPage, previousPage, previousButton);
    startLetterCarousel();
  });

  nextButton.disabled = !nextPage;
  nextButton.addEventListener("click", () => {
    if (!nextPage) return;
    navigateLetter(letterPage, nextPage, nextButton);
    startLetterCarousel();
  });
});

document.addEventListener("click", (event) => {
  const clickedMenu = event.target.closest(".letter-song-actions");
  const clickedLink = event.target.closest(".letter-song-menu a");

  document.querySelectorAll(".letter-song-actions[open]").forEach((menu) => {
    if (menu === clickedMenu && !clickedLink) return;
    window.setTimeout(() => {
      menu.open = false;
    }, 0);
  });
});

document
  .querySelector(".dialog-close")
  .addEventListener("click", () => feelingsDialog.close());

feelingsDialog.addEventListener("click", (event) => {
  if (event.target === feelingsDialog) {
    feelingsDialog.close();
  }
});

document.querySelectorAll("[data-feeling]").forEach((button) => {
  button.addEventListener("click", () => {
    refreshToday();
    if (!isTestMode && responseByDate.has(todayKey)) return;

    document
      .querySelectorAll("[data-feeling]")
      .forEach((option) =>
        option.classList.toggle("is-selected", option === button),
      );
    recordTodayResponse(button.dataset.calendarMark);
    const choseLove = button.dataset.calendarMark === "heart";
    const dailyPhrase = getDailyLovePhrase(today);
    feelingResponseTitle.textContent = choseLove ? "Oi amor 🥰" : "Oi neném 🌧️";
    dailyLoveLanguage.textContent = dailyPhrase.language;
    dailyLovePhraseText.textContent = dailyPhrase.phrase;
    dailyLovePhrase.hidden = false;
    feelingResponseText.textContent =
      button.dataset.response === "full"
        ? "Eu te amo com cada batida do meu coração, nos meus sonhos você é a mulher que carrega meu filhos numa viagem de familia, é voce que mora comigo, é voce que acorda do meu lado todos os dias... É você a pessoa que eu queria passar o resto da minha vida. É você que eu quero amar!"
        : choseLove
          ? "Obrigado por ter me amado hoje, eu sinto muitos medos de todas as formas possíveis, mas saber que todos os dias você pensa em mim, demonstra por mim o seu amor, me deixa mais aliviada, obrigada por isso! Eu te amo. ❤️"
          : "Desculpe por não ter sido o que você esperava de mim dessa vez, mas prometo que serei um pouquinho melhor a cada dia que passar e espero que você possa confiar o seu coraçãozinho um pouco mais para eu cuidar! Eu te amo ❤️";
    feelingResponse.hidden = false;
    feelingsDialog
      .querySelector(".feelings-content")
      .classList.add("has-response");
    feelingsDialog.classList.add("has-response");
  });
});

let today = new Date();
today.setHours(0, 0, 0, 0);
const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
let todayKey = toDateKey(today);
let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today);
const responseStorageKey = "aj-feelings-responses";
const legacyActivationStorageKey = "aj-feelings-activated-dates";
let responseByDate = new Map();

try {
  const storedResponses = JSON.parse(
    localStorage.getItem(responseStorageKey) || "null",
  );
  if (storedResponses && !Array.isArray(storedResponses)) {
    responseByDate = new Map(
      Object.entries(storedResponses).filter(([, mark]) =>
        ["cross", "heart"].includes(mark),
      ),
    );
  } else {
    const storedDates = JSON.parse(
      localStorage.getItem(legacyActivationStorageKey) || "[]",
    );
    if (Array.isArray(storedDates)) {
      responseByDate = new Map(
        storedDates.map((dateKey) => [dateKey, "heart"]),
      );
    }
  }
} catch {
  responseByDate = new Map();
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function updateCalendarMessage() {
  const formattedDate = dateFormatter.format(selectedDate);
  const selectedKey = toDateKey(selectedDate);
  const responseMark = responseByDate.get(selectedKey);
  const message = responseMark
    ? `Respondido: ${formattedDate} (${responseMark === "cross" ? "X" : "♥"})`
    : selectedKey === todayKey
      ? `Hoje: ${formattedDate}`
      : `Sem resposta: ${formattedDate}`;
  calendarMessages.forEach((calendarMessage) => {
    calendarMessage.textContent = message;
  });
}

function refreshToday() {
  today = new Date();
  today.setHours(0, 0, 0, 0);
  todayKey = toDateKey(today);
}

function getDailyLovePhrase(date) {
  const currentDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const daysSinceStart = Math.floor(
    (currentDate - dailyLovePhraseStart) / 86400000,
  );
  const phraseIndex =
    ((daysSinceStart % dailyLovePhrases.length) + dailyLovePhrases.length) %
    dailyLovePhrases.length;
  return dailyLovePhrases[phraseIndex];
}

function openFeelingsDialog() {
  refreshToday();
  updateFeelingsButton();
  displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = new Date(today);
  renderCalendar();
  updateCalendarMessage();

  const hasRespondedToday = !isTestMode && responseByDate.has(todayKey);
  if (hasRespondedToday) {
    feelingResponseTitle.textContent = "Oi meu bem ☀️";
    const dailyPhrase = getDailyLovePhrase(today);
    dailyLoveLanguage.textContent = dailyPhrase.language;
    dailyLovePhraseText.textContent = dailyPhrase.phrase;
  }
  dailyLovePhrase.hidden = !hasRespondedToday;
  feelingOptions.hidden = hasRespondedToday;
  feelingResponseText.textContent = hasRespondedToday
    ? "Você já respondeu hoje. Volte amanhã para responder novamente."
    : "";
  feelingResponse.hidden = !hasRespondedToday;
  feelingsDialog
    .querySelector(".feelings-content")
    .classList.toggle("has-response", hasRespondedToday);
  feelingsDialog.classList.toggle("has-response", hasRespondedToday);
  feelingResponse.classList.toggle("is-repeat", hasRespondedToday);
  feelingsDialog.showModal();
}

function recordTodayResponse(mark) {
  responseByDate.set(todayKey, mark);
  updateFeelingsButton();
  if (!isTestMode) {
    try {
      localStorage.setItem(
        responseStorageKey,
        JSON.stringify(Object.fromEntries(responseByDate)),
      );
    } catch {
      // Keep the response in memory when browser storage is unavailable.
    }
  }

  displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = new Date(today);
  renderCalendar();
  updateCalendarMessage();
}

function updateFeelingsButton() {
  if (!feelingsHeart || !feelingsCheck) return;

  const hasRespondedToday = responseByDate.has(todayKey);
  feelingsCheck.hidden = !hasRespondedToday;
  feelingsHeart.setAttribute(
    "aria-label",
    hasRespondedToday
      ? "Você já respondeu hoje"
      : "Como você está se sentindo?",
  );
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.max(
    35,
    Math.ceil((firstWeekday + daysInMonth) / 7) * 7,
  );
  const formattedMonth = monthFormatter.format(displayedMonth);
  monthLabels.forEach((monthLabel) => {
    monthLabel.textContent =
      formattedMonth[0].toLocaleUpperCase("pt-BR") + formattedMonth.slice(1);
  });

  calendarGrids.forEach((calendarGrid) => {
    calendarGrid.replaceChildren();

    for (let index = 0; index < cellCount; index += 1) {
      const date = new Date(year, month, index - firstWeekday + 1);
      const dateKey = toDateKey(date);
      const isAdjacent = date.getMonth() !== month;
      const isToday = dateKey === todayKey;
      const responseMark = responseByDate.get(dateKey);
      const isHeartActivated = responseMark === "heart";
      const isCrossMarked = responseMark === "cross";
      const isSelected = dateKey === toDateKey(selectedDate);
      const button = document.createElement("button");
      const number = document.createElement("span");
      const heart = document.createElement("span");

      button.type = "button";
      button.className = `calendar-day${isAdjacent ? " is-adjacent" : ""}${isToday ? " is-today" : ""}${isHeartActivated ? " is-heart-activated" : ""}${isCrossMarked ? " is-cross-marked" : ""}`;
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute(
        "aria-label",
        `${dateFormatter.format(date)}${isToday ? ", hoje" : ""}${isHeartActivated ? ", resposta com coração, respondido" : isCrossMarked ? ", resposta com X, respondido" : ", sem resposta"}`,
      );
      if (isToday) button.setAttribute("aria-current", "date");

      number.className = "day-number";
      number.textContent = String(date.getDate());
      heart.className = "day-heart";
      heart.setAttribute("aria-hidden", "true");
      heart.textContent = isCrossMarked ? "×" : "♥";
      button.append(number, heart);

      button.addEventListener("click", () => {
        selectedDate = new Date(date);
        if (isAdjacent)
          displayedMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        renderCalendar();
        updateCalendarMessage();
      });

      calendarGrid.append(button);
    }
  });
}

document.querySelectorAll("[data-month-shift]").forEach((button) => {
  button.addEventListener("click", () => {
    displayedMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + Number(button.dataset.monthShift),
      1,
    );
    renderCalendar();
  });
});

renderCalendar();
updateCalendarMessage();
updateFeelingsButton();

// Efeito de batida, frases espalhadas e caixinha indicativa no clique do coração
const pulsingHeart = document.getElementById("pulsingHeart");
const heartContainer = document.querySelector(".heart-container");
const heartHint = document.getElementById("heartHint");

const lovePhrases = [
  "Eu te amo",
  "Eu te quero",
  "Eu te desejo",
  "Eu te vejo",
  "Sinto sua falta",
  "Penso em você",
  "Vivo por você",
  "Meu porto seguro",
  "Minha pessoa favorita",
  "Meu amor todinho",
  "Razão do sorriso",
  "Sempre com você",
  "Você me completa",
  "Amo seu abraço",
  "Dona do coração",
  "Você é tudo pra mim",
  "Adoro seu cheiro",
  "Minha paz diária",
  "Paixão da vida",
  "Anjo da guarda",
  "Meu bem precioso",
  "Meu mundo inteiro",
  "Meu coração bate por você",
  "Eu te sinto",
  "Você é meu tudo",
  "Amor da minha vida",
  "Meu raio de sol",
  "Meu sonho realizado",
  "Meu amor eterno",
  "Minha felicidade",
];

const positions = [
  { top: "10%", left: "50%", transform: "translateX(-50%)" },
  { top: "16%", left: "20%", transform: "none" },
  { top: "16%", right: "20%", left: "auto", transform: "none" },
  { top: "45%", left: "8%", transform: "none" },
  { top: "45%", right: "8%", left: "auto", transform: "none" },
  { top: "72%", left: "20%", transform: "none" },
  { top: "72%", right: "20%", left: "auto", transform: "none" },
  { top: "82%", left: "50%", transform: "translateX(-50%)" },
];

let phraseIndex = 0;
let positionIndex = 0;
let lastPhraseElement = null; // Guarda referência estrita da última frase gerada

if (pulsingHeart && heartContainer) {
  pulsingHeart.addEventListener("click", () => {
    // 1. Esconde a caixinha imediatamente ao clicar
    if (heartHint) {
      heartHint.classList.add("hidden");
    }

    // 2. Dispara o pulso do coração
    pulsingHeart.classList.remove("pulse-click");
    void pulsingHeart.offsetWidth;
    pulsingHeart.classList.add("pulse-click");

    // 3. Cria o elemento da frase
    const phraseElement = document.createElement("div");
    phraseElement.className = "floating-phrase show";
    phraseElement.textContent = lovePhrases[phraseIndex];

    // Marca esta como a última frase gerada
    lastPhraseElement = phraseElement;

    // 4. Aplica a posição atual
    const pos = positions[positionIndex];
    phraseElement.style.top = pos.top;
    phraseElement.style.left = pos.left || "auto";
    phraseElement.style.right = pos.right || "auto";
    if (pos.transform !== "none") {
      phraseElement.style.transform = pos.transform;
    }

    // 5. Insere no container
    heartContainer.appendChild(phraseElement);

    // 6. Avança os índices de frase e posição
    phraseIndex = (phraseIndex + 1) % lovePhrases.length;
    positionIndex = (positionIndex + 1) % positions.length;

    // 7. Remove a frase e faz a caixinha voltar ASSIM QUE A ÚLTIMA CriadA terminar
    phraseElement.addEventListener("animationend", () => {
      phraseElement.remove();

      // Se a frase que acabou de sumir foi exatamente a última a ser criada, a caixinha reaparece!
      if (lastPhraseElement === phraseElement) {
        if (heartHint) {
          heartHint.classList.remove("hidden");
        }
      }
    });
  });

  pulsingHeart.addEventListener("animationend", () => {
    pulsingHeart.classList.remove("pulse-click");
  });
}

const letterHeartButton = document.querySelector("[data-letter-heart]");
const letterHeartContainer = document.querySelector(
  "[data-letter-heart-container]",
);
const letterHeartEmojiLayer = document.querySelector(
  "[data-letter-heart-emojis]",
);
const letterHeartHint = document.querySelector("[data-letter-heart-hint]");
const letterHeartEmojis = ["🌷", "🌻", "☀️", "🍒", "🩷", "💛", "🧸"];
let letterHeartEmojiDeck = [];
let previousLetterHeartEmoji = null;
let latestLetterHeartEmoji = null;

function createShuffledDeck(items, previousItem) {
  const deck = [...items];

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }

  if (deck.length > 1 && deck[deck.length - 1] === previousItem) {
    const lastIndex = deck.length - 1;
    [deck[lastIndex], deck[lastIndex - 1]] = [
      deck[lastIndex - 1],
      deck[lastIndex],
    ];
  }

  return deck;
}

if (letterHeartButton && letterHeartContainer && letterHeartEmojiLayer) {
  letterHeartButton.addEventListener("click", () => {
    letterHeartHint?.classList.add("hidden");
    letterHeartButton.classList.remove("pulse-click");
    void letterHeartButton.offsetWidth;
    letterHeartButton.classList.add("pulse-click");

    const emoji = document.createElement("span");
    emoji.className = "letter-heart-emoji";
    if (!letterHeartEmojiDeck.length) {
      letterHeartEmojiDeck = createShuffledDeck(
        letterHeartEmojis,
        previousLetterHeartEmoji,
      );
    }
    const emojiValue = letterHeartEmojiDeck.pop();
    previousLetterHeartEmoji = emojiValue;
    emoji.textContent = emojiValue;

    emoji.style.left = `${4 + Math.random() * 86}%`;
    emoji.style.top = `${4 + Math.random() * 86}%`;
    emoji.style.setProperty(
      "--emoji-drift-x",
      `${Math.round(Math.random() * 60 - 30)}px`,
    );
    emoji.style.setProperty(
      "--emoji-rise",
      `${Math.round(-24 - Math.random() * 36)}px`,
    );
    emoji.style.setProperty(
      "--emoji-rotation",
      `${Math.round(Math.random() * 24 - 12)}deg`,
    );
    latestLetterHeartEmoji = emoji;
    letterHeartEmojiLayer.appendChild(emoji);

    emoji.addEventListener("animationend", () => {
      emoji.remove();
      if (latestLetterHeartEmoji === emoji) {
        letterHeartHint?.classList.remove("hidden");
      }
    });
  });

  letterHeartButton.addEventListener("animationend", () => {
    letterHeartButton.classList.remove("pulse-click");
  });
}
