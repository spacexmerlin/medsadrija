class MagneticCarousel {
  constructor(root) {
    this.root = root;
    this.bars = Array.from(root.querySelectorAll('.magnetic-carousel__bar'));
    this.backdrop = root.querySelector('.magnetic-carousel__backdrop');
    this.openIndex = null;
    this.target = this.bars.map(() => 0);
    this.cur = this.bars.map(() => 0);
    this.rafId = 0;
    this.closeTimer = 0;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.readSizes();
    this.bindEvents();

    window.addEventListener('resize', () => this.readSizes());
  }

  readSizes() {
    const cs = getComputedStyle(this.root);
    this.collapsedW = parseFloat(cs.getPropertyValue('--collapsed-w'));
    this.hoverW = parseFloat(cs.getPropertyValue('--hover-w'));
    this.collapsedH = parseFloat(cs.getPropertyValue('--collapsed-h'));
    this.hoverH = parseFloat(cs.getPropertyValue('--hover-h'));
    this.openSize = parseFloat(cs.getPropertyValue('--open-size'));
    this.gap = parseFloat(cs.getPropertyValue('--gap'));
    this.influence = parseFloat(cs.getPropertyValue('--influence'));
    this.applySizes();
  }

  bindEvents() {
    this.root.addEventListener('mousemove', (e) => this.onMove(e));
    this.root.addEventListener('mouseleave', () => this.onLeave());
    this.bars.forEach((bar, i) => {
      bar.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle(i);
      });
    });
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.openIndex !== null) this.close();
    });
  }

  onMove(e) {
    if (this.openIndex !== null || this.reduceMotion) return;
    const rect = this.root.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const n = this.bars.length;
    const totalBase = n * this.collapsedW + (n - 1) * this.gap;
    const startX = (rect.width - totalBase) / 2;
    this.target = this.bars.map((_, i) => {
      const center = startX + i * (this.collapsedW + this.gap) + this.collapsedW / 2;
      const dist = Math.abs(cx - center);
      const f = Math.max(0, 1 - dist / this.influence);
      return f * f * (3 - 2 * f);
    });
    this.startLoop();
  }

  onLeave() {
    if (this.openIndex !== null) return;
    this.target = this.bars.map(() => 0);
    this.startLoop();
  }

  startLoop() {
    if (this.rafId) return;
    const step = () => {
      let moving = false;
      this.cur = this.cur.map((c, i) => {
        const t = this.target[i] ?? 0;
        const d = t - c;
        if (Math.abs(d) > 0.001) {
          moving = true;
          return c + d * 0.2;
        }
        return t;
      });
      this.applySizes();
      this.rafId = moving ? requestAnimationFrame(step) : 0;
    };
    this.rafId = requestAnimationFrame(step);
  }

  applySizes() {
    this.bars.forEach((bar, i) => {
      if (this.openIndex !== null) {
        if (i === this.openIndex) {
          bar.style.width = this.openSize + 'px';
          bar.style.height = this.openSize + 'px';
        } else {
          bar.style.width = this.collapsedW + 'px';
          bar.style.height = this.collapsedH + 'px';
        }
        return;
      }
      const f = this.cur[i] || 0;
      bar.style.width = this.collapsedW + (this.hoverW - this.collapsedW) * f + 'px';
      bar.style.height = this.collapsedH + (this.hoverH - this.collapsedH) * f + 'px';
    });
  }

  toggle(i) {
    if (this.openIndex === i) {
      this.close();
    } else {
      this.open(i);
    }
  }

  open(i) {
    clearTimeout(this.closeTimer);
    this.openIndex = i;
    this.root.classList.add('has-open');
    if (this.backdrop) this.backdrop.classList.add('is-active');
    this.cur = this.bars.map(() => 0);
    this.target = this.bars.map(() => 0);
    this.bars.forEach((bar, idx) => {
      bar.classList.toggle('is-open', idx === i);
      bar.classList.toggle('is-blurred', idx !== i);
      bar.setAttribute('aria-expanded', String(idx === i));
    });
    this.applySizes();
  }

  close() {
    this.openIndex = null;
    if (this.backdrop) this.backdrop.classList.remove('is-active');
    this.bars.forEach((bar) => {
      bar.classList.remove('is-open', 'is-blurred');
      bar.setAttribute('aria-expanded', 'false');
    });
    this.applySizes();
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.root.classList.remove('has-open'), 400);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.magnetic-carousel').forEach((el) => new MagneticCarousel(el));
});
