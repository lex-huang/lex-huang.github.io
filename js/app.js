(function() {
    'use strict';

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    const on = (element, event, handler, options) => {
        if (element) element.addEventListener(event, handler, options);
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    class MatrixRain {
        constructor(canvasId = '#bg-canvas') {
            this.canvas = $(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.drops = [];
            this.fontSize = 16;
            this.chars = '01';
            this.timer = null;
            this.lastTime = 0;
            this.interval = 50;
            this.mouseX = -1000;
            this.mouseY = -1000;
            
            if (this.canvas) this.init();
        }

        init() {
            this.resize();
            
            let resizeTimer;
            on(window, 'resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.resize(), 200);
            });
            
            on(document, 'mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            
            this.start();
        }

        resize() {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.columns = this.width / this.fontSize;
            this.drops = [];
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.floor(Math.random() * -100);
            }
        }

        draw() {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.font = this.fontSize + 'px monospace';
            
            for (let i = 0; i < this.drops.length; i++) {
                const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
                
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;
                const dist = Math.hypot(x - this.mouseX, y - this.mouseY);
                
                if (dist < 100) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.shadowBlur = 5;
                    this.ctx.shadowColor = '#fff';
                } else {
                    this.ctx.fillStyle = Math.random() > 0.98 ? '#fff' : '#0f0';
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fillText(text, x, y);
                this.ctx.shadowBlur = 0;

                if (this.drops[i] * this.fontSize > this.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
        }

        start() {
            if (this.timer) cancelAnimationFrame(this.timer);
            
            const animate = (timestamp) => {
                if (!this.lastTime) this.lastTime = timestamp;
                const deltaTime = timestamp - this.lastTime;
                
                if (deltaTime > this.interval) {
                    this.draw();
                    this.lastTime = timestamp - (deltaTime % this.interval);
                }
                this.timer = requestAnimationFrame(animate);
            };
            
            this.timer = requestAnimationFrame(animate);
        }

        stop() {
            if (this.timer) {
                cancelAnimationFrame(this.timer);
                this.timer = null;
            }
        }

        resume() {
            if (!this.timer) {
                this.lastTime = 0;
                this.start();
            }
        }
    }

    class AmbientConsole {
        constructor(selector, commands) {
            this.el = $(selector);
            this.commands = commands || [];
            this.defaultText = this.el ? this.el.textContent : '';
            this.isAnimating = false;
            
            if (this.el && this.commands.length > 0) this.start();
        }

        start() {
            setInterval(() => {
                if (!this.isAnimating && Math.random() > 0.7 && !document.hidden) {
                    this.runSequence();
                }
            }, 6000);
        }

        async runSequence() {
            this.isAnimating = true;
            const cmd = this.commands[Math.floor(Math.random() * this.commands.length)];
            
            await this.type(this.defaultText, true);
            await this.type(cmd);
            await new Promise(r => setTimeout(r, 1500));
            await this.type(cmd, true);
            await this.type(this.defaultText);
            
            this.isAnimating = false;
        }

        type(text, isDelete = false) {
            return new Promise(resolve => {
                let steps = 0;
                const totalSteps = text.length;
                const speed = isDelete ? 30 : 60;
                
                const interval = setInterval(() => {
                    steps++;
                    if (isDelete) {
                        this.el.textContent = text.substring(0, totalSteps - steps);
                    } else {
                        this.el.textContent = text.substring(0, steps);
                    }
                    
                    if (steps >= totalSteps) {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            });
        }
    }

    class Typewriter {
        constructor(elementId, text, speed = 100, delay = 0) {
            this.element = $('#' + elementId);
            this.text = text || '';
            this.speed = speed;
            this.delay = delay;
            this.index = 0;
        }

        start() {
            if (!this.element) return;
            if (this.delay > 0) {
                setTimeout(() => this._type(), this.delay);
            } else {
                this._type();
            }
        }

        _type() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(() => this._type(), this.speed);
            }
        }
    }

    class BootLoader {
        constructor() {
            this.bootScreen = $('#boot-screen');
            this.logContainer = $('#boot-log');
            this.logs = [
                "Linux version 6.5.0-generic (buildd@lcy02-amd64-032)",
                "Command line: BOOT_IMAGE=/boot/vmlinuz-6.5.0-generic root=UUID=1a2b3c4d ro quiet splash",
                "BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
                "SMBIOS 2.8 present.",
                "DMI: Portfolio/VirtualBox, BIOS VirtualBox 12/01/2006",
                "tsc: Fast TSC calibration using PIT",
                "tcp: Detected 2800.000 MHz processor",
                "[  OK  ] Created slice System Slice.",
                "[  OK  ] Listening on Journal Socket.",
                "[  OK  ] Started Journal Service.",
                "[  OK  ] Started Network Manager.",
                "[  OK  ] Reached target Network.",
                "Starting OpenSSH server...",
                "[  OK  ] Started OpenSSH server.",
                "Mounting /home/user/portfolio...",
                "[  OK  ] Mounted /home/user/portfolio.",
                "[  OK  ] Reached target Graphical Interface.",
                "Loading CSS Stylesheet...",
                "[  OK  ] Loaded style.css",
                "Initializing JavaScript Modules...",
                "[  OK  ] Loaded app.js",
                "[  OK  ] Loaded config.js",
                "Starting Matrix Rain Engine...",
                "[  OK  ] Matrix Rain initialized (Canvas 2D)",
                "Checking font resources...",
                "[  OK  ] Fira Code detected.",
                "Loading Gallery assets...",
                "Scanning /pic directory...",
                "[  OK  ] Found images.",
                "Configuring Resume data...",
                "[  OK  ] Parsed resume.json",
                "Establishing secure connection...",
                "[  OK  ] Connection established (HTTPS)",
                "System Check Complete.",
                "Welcome to Portfolio OS 1.0 LTS",
                "Initializing terminal environment...",
                "Booting..."
            ];
            
            this.currentIndex = 0;
            this.minDuration = 3000;
            this.startTime = Date.now();
            this.isBootComplete = false;
            this.isWindowLoaded = false;
            this.spinnerFrames = ['/', '-', '\\', '|'];
            this.spinnerIndex = 0;
            
            on(window, 'load', () => { this.isWindowLoaded = true; });
        }
        
        start(onComplete) {
            if (!this.bootScreen) {
                if (onComplete) onComplete();
                return;
            }
            this.onComplete = onComplete;
            this.addLog();
        }
        
        addLog() {
            if (this.currentIndex >= this.logs.length) {
                const elapsedTime = Date.now() - this.startTime;
                if (elapsedTime < this.minDuration || !this.isWindowLoaded) {
                    let spinnerRow = $('#boot-spinner-row');
                    if (!spinnerRow) {
                         spinnerRow = document.createElement('p');
                         spinnerRow.id = 'boot-spinner-row';
                         const timestamp = ((Date.now() - this.startTime) / 1000).toFixed(6);
                         spinnerRow.innerHTML = `<span class="log-time">[${timestamp}]</span> Verifying system integrity... <span id="spinner" style="font-weight:bold; color:#0f0;">/</span>`;
                         this.logContainer.appendChild(spinnerRow);
                         window.scrollTo(0, document.body.scrollHeight);
                         this.logContainer.scrollTop = this.logContainer.scrollHeight;
                    } else {
                         const spinner = $('#spinner');
                         if (spinner) {
                             this.spinnerIndex = (this.spinnerIndex + 1) % 4;
                             spinner.textContent = this.spinnerFrames[this.spinnerIndex];
                         }
                    }
                    setTimeout(() => this.addLog(), 100);
                    return;
                }
                if (!this.isBootComplete) {
                    this.isBootComplete = true;
                    this.finish();
                }
                return;
            }

            const line = this.logs[this.currentIndex];
            const p = document.createElement('p');
            const timestamp = ((Date.now() - this.startTime) / 1000).toFixed(6);
            
            if (line.startsWith('[')) {
                if (line.includes('[  OK  ]')) {
                    p.innerHTML = `<span class="log-ok">[  OK  ]</span> ${line.substring(9)}`;
                } else {
                    p.textContent = line;
                }
            } else {
                 p.innerHTML = `<span class="log-time">[${timestamp}]</span> ${line}`;
            }
            
            this.logContainer.appendChild(p);
            window.scrollTo(0, document.body.scrollHeight);
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
            this.currentIndex++;
            
            let delay = 10 + Math.random() * 20;
            if (line.includes('Loading') || line.includes('Scanning') || line.includes('Initializing')) {
                delay += 200 + Math.random() * 200;
            }
            
            setTimeout(() => this.addLog(), delay);
        }
        
        finish() {
            this.bootScreen.style.opacity = '0';
            setTimeout(() => {
                this.bootScreen.style.display = 'none';
                if (this.onComplete) this.onComplete();
            }, 500);
        }
    }

    class ResumeTOC {
        constructor() {
            this.container = $('#resume-container');
            this.content = $('.resume-content');
            this.toggleBtn = $('#toc-toggle');
            if (!this.container || !this.content) return;
            
            this.init();
        }

        init() {
            const headings = this.content.querySelectorAll('h2');
            if (headings.length === 0) return;

            this.content.style.position = 'relative';

            const toc = document.createElement('div');
            toc.className = 'resume-toc';
            toc.innerHTML = '<h3>NAVIGATION</h3><ul></ul>';
            const ul = toc.querySelector('ul');

            headings.forEach((h2, index) => {
                const id = 'section-' + index;
                h2.id = id;
                const li = document.createElement('li');
                li.innerHTML = `<a href="#${id}">${h2.textContent}</a>`;
                ul.appendChild(li);
            });

            this.content.appendChild(toc);
            
            // Toggle Button Logic (Mobile)
            if (this.toggleBtn) {
                on(this.toggleBtn, 'click', (e) => {
                    e.stopPropagation();
                    toc.classList.toggle('active');
                });

                // Close when clicking outside
                on(document, 'click', (e) => {
                    if (toc.classList.contains('active') && 
                        !toc.contains(e.target) && 
                        e.target !== this.toggleBtn) {
                        toc.classList.remove('active');
                    }
                });
            }
            
            on(toc, 'click', (e) => {
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                    const targetId = e.target.getAttribute('href');
                    const target = $(targetId);
                    if (target) {
                        this.container.scrollTo({
                            top: target.offsetTop - 100, 
                            behavior: 'smooth'
                        });
                    }
                    // Auto close on mobile
                    if (window.innerWidth < 1400) {
                        toc.classList.remove('active');
                    }
                }
            });
        }
    }

    class Gallery {
        constructor() {
            this.photoGrid = $('#photo-grid');
            this.lightbox = $('#lightbox');
            this.lightboxImg = $('#lightbox-img');
            this.lightboxCaption = $('#lightbox-caption');
            this.lightboxLoader = $('#lightbox-loader');
            this.lightboxError = $('#lightbox-error');
            this.closeLightbox = $('.close-lightbox');
            this.prevBtn = $('#lightbox-prev');
            this.nextBtn = $('#lightbox-next');
            
            this.photos = (window.PortfolioConfig && window.PortfolioConfig.photos) ? window.PortfolioConfig.photos : [];

            if (this.photos.length > 0) {
                this.photos.slice(0, 3).forEach(photo => new Image().src = photo.src);
            }

            this.observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.onload = () => img.classList.add('loaded');
                            img.removeAttribute('data-src');
                            obs.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '150%' });

            if (this.photoGrid) this.init();
        }

        init() {
            this.renderGrid();
            this.bindLightboxEvents();
            this.bindGridEvents();
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
        }

        renderGrid() {
            const fragment = document.createDocumentFragment();
            this.photos.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'photo-item';
                item.dataset.index = index;
                const captionHtml = photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : '';
                item.innerHTML = `
                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                         data-src="${photo.src}" alt="Photo ${index + 1}" class="lazy"
                         onerror="this.parentElement.classList.add('load-error')">
                    ${captionHtml}`;
                fragment.appendChild(item);
                const imgEl = item.querySelector('img');
                if (imgEl) this.observer.observe(imgEl);
            });
            this.photoGrid.appendChild(fragment);
        }

        bindGridEvents() {
            on(this.photoGrid, 'click', (e) => {
                const item = e.target.closest('.photo-item');
                if (!item) return;
                const index = item.dataset.index;
                const img = item.querySelector('img');
                if (img && img.classList.contains('loaded') && img.naturalHeight !== 0) {
                    this.openLightbox(parseInt(index));
                }
            });
        }

        openLightbox(index) {
            if (!this.lightboxImg || index < 0 || index >= this.photos.length) return;
            this.currentPhotoIndex = index;
            this.updateLightboxContent();
            this.lightbox.classList.add('active');
        }

        updateLightboxContent() {
            const photo = this.photos[this.currentPhotoIndex];
            if (this.lightboxLoader) this.lightboxLoader.classList.add('active');
            if (this.lightboxError) this.lightboxError.classList.remove('active');
            this.lightboxImg.style.opacity = '0.5';
            
            this.lightboxImg.onload = () => {
                if (this.lightboxLoader) this.lightboxLoader.classList.remove('active');
                this.lightboxImg.style.opacity = '1';
            };
            this.lightboxImg.onerror = () => {
                if (this.lightboxLoader) this.lightboxLoader.classList.remove('active');
                if (this.lightboxError) this.lightboxError.classList.add('active');
                this.lightboxImg.style.opacity = '0';
            };
            this.lightboxImg.src = photo.src;
            if (this.lightboxCaption) {
                const text = photo.caption || '';
                this.lightboxCaption.textContent = text;
                this.lightboxCaption.style.display = text ? 'block' : 'none';
            }
        }
        
        navigateLightbox(direction) {
            if (!this.lightbox.classList.contains('active')) return;
            let newIndex = this.currentPhotoIndex + direction;
            if (newIndex < 0) newIndex = this.photos.length - 1;
            if (newIndex >= this.photos.length) newIndex = 0;
            this.currentPhotoIndex = newIndex;
            this.updateLightboxContent();
        }

        closeLightboxFunc() {
            if (this.lightbox) this.lightbox.classList.remove('active');
        }

        bindLightboxEvents() {
            on(this.closeLightbox, 'click', () => this.closeLightboxFunc());
            on(this.lightbox, 'click', (e) => {
                if (e.target === this.lightbox) this.closeLightboxFunc();
            });

            let touchStartX = 0, touchEndX = 0;
            on(this.lightbox, 'touchstart', (e) => touchStartX = e.changedTouches[0].screenX, { passive: true });
            on(this.lightbox, 'touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX < touchStartX - 50) this.navigateLightbox(1);
                if (touchEndX > touchStartX + 50) this.navigateLightbox(-1);
            }, { passive: true });

            on(this.prevBtn, 'click', (e) => { e.stopPropagation(); this.navigateLightbox(-1); });
            on(this.nextBtn, 'click', (e) => { e.stopPropagation(); this.navigateLightbox(1); });
            
            on(document, 'keydown', (e) => {
                if (!this.lightbox.classList.contains('active')) return;
                if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
                if (e.key === 'ArrowRight') this.navigateLightbox(1);
            });

            on(this.lightbox, 'wheel', throttle((e) => {
                e.preventDefault();
                if (e.deltaY > 0) {
                    this.navigateLightbox(1);
                } else {
                    this.navigateLightbox(-1);
                }
            }, 400), { passive: false });
        }
    }

    class App {
        constructor() {
            this.terminal = $('#terminal-container');
            this.gallery = $('#gallery-container');
            this.resume = $('#resume-container');
            
            const typeText = (window.PortfolioConfig && window.PortfolioConfig.typewriterText) ?
                              window.PortfolioConfig.typewriterText : "Code & Capture & Create";
            this.mainTypewriter = new Typewriter('typewriter-text', typeText, 80, 0);

            this.switchTimer = null;
            this.titleInterval = null;
            this.documentTitle = document.title;

            this.matrixRain = new MatrixRain();
            this.galleryManager = new Gallery();
            this.bootLoader = new BootLoader();
            this.resumeTOC = new ResumeTOC();

            this.init();
        }

        init() {
            this.showEasterEgg();

            if (document.body.dataset.page === '404') {
                this.init404();
                return;
            }
            
            new AmbientConsole('.command-line h1', ['uptime', 'whoami', 'date', 'ps aux | grep portfolio', 'free -h']);
            this.bindEvents();
            this.startTitleLoop();
            
            const params = new URLSearchParams(window.location.search);
            const toPage = params.get('to');

            if (toPage) {
                if (this.bootLoader.bootScreen) this.bootLoader.bootScreen.style.display = 'none';
                if (this.mainTypewriter.element) this.mainTypewriter.element.textContent = this.mainTypewriter.text;
                this.updateUptime();
                setInterval(() => this.updateUptime(), 1000);

                if (toPage === 'md') this.switchPage('resume-container');
                else if (toPage === 'pic') this.switchPage('gallery-container');
            } else {
                if (this.bootLoader) this.bootLoader.start(() => this.onBootComplete());
                else this.onBootComplete();
            }
        }

        showEasterEgg() {
             console.log(
                `%c
  _      ______ _    _ 
 | |    |  ____| \\  / |
 | |    | |__   \\ \\/ / 
 | |    |  __|   >  <  
 | |____| |____ / /\\ \\ 
 |______|______/_/  \\_\\
 
 %cWelcome to the matrix...
                `, 
                'color: #0f0; font-weight: bold; font-family: monospace; font-size: 14px;',
                'color: #ccc; font-family: monospace; font-size: 12px;'
            );
        }

        init404() {
             on(document, 'keydown', (e) => {
                if (e.key === 'Enter') window.location.href = 'index.html';
             });
             new Typewriter('typewriter-404', "cd /home", 100, 500).start();
             new AmbientConsole('.command-line h1', ['ping host...', 'tracepath', 'diagnosing connection...', 'cat /var/log/syslog']);
             
             const footerText = $('.terminal-footer span');
             if (footerText) {
                 footerText.classList.add('glitch-text');
                 footerText.setAttribute('data-text', footerText.textContent);
             }
        }

        startTitleLoop() {
            this.stopTitleLoop();
            const titles = (window.PortfolioConfig && window.PortfolioConfig.titles) ? 
                           window.PortfolioConfig.titles : ['Portfolio', 'Developer'];
            let i = 0;
            document.title = titles[0];
            this.titleInterval = setInterval(() => {
                i = (i + 1) % titles.length;
                document.title = titles[i];
            }, 3000);
        }

        stopTitleLoop() {
            if (this.titleInterval) { clearInterval(this.titleInterval); this.titleInterval = null; }
        }

        onBootComplete() {
            setTimeout(() => this.mainTypewriter.start(), 800);
            this.updateUptime();
            setInterval(() => this.updateUptime(), 1000);
        }

        updateUptime() {
            const uptimeEl = $('#system-uptime');
            if (!uptimeEl) return;
            const startTime = new Date('2021-07-01T00:00:00');
            const diff = new Date() - startTime;
            const totalSeconds = Math.floor(diff / 1000);
            const years = Math.floor(totalSeconds / (365 * 24 * 3600));
            const days = Math.floor((totalSeconds % (365 * 24 * 3600)) / (24 * 3600));
            const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            uptimeEl.textContent = `System Uptime: ${years} Years ${days} Days ${hours} Hours ${minutes} Mins ${seconds} Secs`;
        }

        switchPage(showId) {
            if (document.activeElement) document.activeElement.blur();
            
            if (this.switchTimer) { clearTimeout(this.switchTimer); this.switchTimer = null; }
            const pages = [this.terminal, this.gallery, this.resume];
            const showEl = $('#' + showId);

            pages.forEach(el => {
                if (!el) return;
                if (el === showEl) {
                    el.classList.remove('hidden');
                    el.style.pointerEvents = 'auto'; 
                    void el.offsetWidth; 
                    el.style.opacity = '1';
                    if (el === this.terminal) el.style.transform = 'scale(1)';
                    else el.classList.add('active'); 
                    if (el !== this.terminal) el.scrollTop = 0;
                } else {
                    if (!el.classList.contains('hidden')) {
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';
                        if (el === this.terminal) el.style.transform = 'scale(0.95)';
                        else el.classList.remove('active');
                    }
                }
            });

            this.switchTimer = setTimeout(() => {
                pages.forEach(el => {
                    if (el && el !== showEl && !el.classList.contains('hidden')) el.classList.add('hidden');
                });
                this.switchTimer = null;
            }, 500);
        }

        bindEvents() {
            on($('#btn-open-gallery'), 'click', (e) => { e.preventDefault(); this.switchPage('gallery-container'); });
            on($('#btn-open-resume'), 'click', (e) => { e.preventDefault(); this.switchPage('resume-container'); });
            on($('#btn-close-resume'), 'click', (e) => { e.preventDefault(); this.switchPage('terminal-container'); });
            on($('#btn-close-gallery'), 'click', (e) => { e.preventDefault(); this.switchPage('terminal-container'); });

            on(document, 'visibilitychange', () => {
                if (document.hidden) {
                    this.stopTitleLoop();
                    this.matrixRain.stop();
                    document.title = '[System Suspended] Connection Lost...';
                } else {
                    document.title = this.documentTitle;
                    this.startTitleLoop();
                    this.matrixRain.resume();
                }
            });

            const setupBackToTop = (container, btnId) => {
                const btn = $('#' + btnId);
                if (!container || !btn) return;
                
                on(container, 'scroll', throttle(() => {
                    if (container.scrollTop > 300) btn.classList.add('visible');
                    else btn.classList.remove('visible');
                }, 100));
                
                on(btn, 'click', () => container.scrollTo({ top: 0, behavior: 'smooth' }));
            };

            setupBackToTop(this.resume, 'back-to-top-resume');
            setupBackToTop(this.gallery, 'back-to-top-gallery');

            on(document, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    if (this.galleryManager && this.galleryManager.lightbox && this.galleryManager.lightbox.classList.contains('active')) {
                        this.galleryManager.closeLightboxFunc();
                        return;
                    }
                    this.switchPage('terminal-container');
                }
            });
        }
    }

    on(document, 'DOMContentLoaded', () => {
        new App();
        on(document, 'contextmenu', (e) => e.preventDefault());
        on(document, 'copy', (e) => e.preventDefault());
        on(document, 'keydown', (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P'))
            ) {
                e.preventDefault();
            }
        });
    });

})();
