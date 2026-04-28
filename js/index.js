window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > 300;
    toTopBtn.classList.toggle("show", shouldShow);
});

toTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});