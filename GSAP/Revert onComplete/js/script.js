gsap.registerPlugin(SplitText, ScrollTrigger);

document.fonts.ready.then(() => {
  let text = document.querySelector(".headline");
  gsap.set(text, { opacity: 1 });

  let mySplitText = SplitText.create(text, {
    type: "chars, words",
    charsClass: "char"
  });
  let chars = mySplitText.chars;

  ScrollTrigger.create({
    trigger: text,
    start: "top 80%", // 텍스트가 화면 아래 80%에 도달했을 때
    once: true,       // 한 번만 실행
    onEnter: () => {
      gsap.from(chars, {
        duration: 3,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.05,
        onComplete: () => {
          mySplitText.revert();
          text.removeAttribute("aria-hidden");
        }
      });
    }
  });
});
