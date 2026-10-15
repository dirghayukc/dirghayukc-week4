
class ImageSlider {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector(".slider-track");

    this.originalSlides = [
      ...this.track.querySelectorAll(".slide")
    ];

    this.slideCount = this.originalSlides.length;

    this.previousButton = root.querySelector(".previous");
    this.nextButton = root.querySelector(".next");
    this.dotsContainer = root.querySelector(".slider-dots");
    this.counter = root.querySelector(".slide-count");


    this.track.prepend(
      this.originalSlides[this.slideCount - 1].cloneNode(true)
    );

    this.track.append(
      this.originalSlides[0].cloneNode(true)
    );

    this.slides = [
      ...this.track.querySelectorAll(".slide")
    ];

    this.index = 1;
    this.isAnimating = false;

    this.createDots();
    this.bindEvents();
    this.render(false);
  }

  createDots() {
    this.dots = this.originalSlides.map(
      (slide, logicalIndex) => {
        const dot = document.createElement("button");

        dot.className = "dot";
        dot.type = "button";

        dot.setAttribute(
          "aria-label",
          `Go to slide ${logicalIndex + 1}`
        );

        dot.addEventListener("click", () => {
          this.goTo(logicalIndex);
        });

        this.dotsContainer.append(dot);

        return dot;
      }
    );
  }

  bindEvents() {
    this.nextButton.addEventListener("click", () => {
      this.next();
    });

    this.previousButton.addEventListener("click", () => {
      this.previous();
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        this.next();
      }

      if (event.key === "ArrowLeft") {
        this.previous();
      }
    });

    this.track.addEventListener(
      "transitionend",
      (event) => {
        if (event.propertyName !== "transform") {
          return;
        }

        this.isAnimating = false;

     
        if (this.index === this.slideCount + 1) {
          this.index = 1;
          this.render(false);
        } else if (this.index === 0) {
          this.index = this.slideCount;
          this.render(false);
        }
      }
    );
  }

  next() {
    if (this.isAnimating) return;

    this.index += 1;
    this.isAnimating = true;

    this.render(true);
  }

  previous() {
    if (this.isAnimating) return;

    this.index -= 1;
    this.isAnimating = true;

    this.render(true);
  }

  goTo(logicalIndex) {
    if (this.isAnimating) return;

    const target = logicalIndex + 1;

    if (target === this.index) return;

    this.index = target;
    this.isAnimating = true;

    this.render(true);
  }

  render(animate = true) {
    this.track.style.transitionDuration =
      animate ? "" : "0ms";

    this.track.style.transform =
      `translateX(-${this.index * 100}%)`;

    const logicalIndex =
      this.index === 0
        ? this.slideCount - 1
        : this.index === this.slideCount + 1
          ? 0
          : this.index - 1;

    this.dots.forEach((dot, i) => {
      const active = i === logicalIndex;

      dot.setAttribute(
        "aria-current",
        String(active)
      );

      dot.disabled = active;
    });

    this.counter.textContent =
      `${String(logicalIndex + 1).padStart(2, "0")} / ` +
      `${String(this.slideCount).padStart(2, "0")}`;

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transitionDuration = "";
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider").forEach(
    (slider) => new ImageSlider(slider)
  );
});
