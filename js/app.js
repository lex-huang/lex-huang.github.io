/**
 * Terminal Portfolio - Main Application
 * Optimized & Bundled
 */
(function() {
    'use strict';

    /* =========================================
       MatrixRain - Background Effect
       ========================================= */
    class MatrixRain {
        constructor(canvasId = 'bg-canvas') {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.drops = [];
            this.fontSize = 16;
            this.chars = '01';
            this.timer = null;
            
            if (this.canvas) {
                this.init();
            }
        }

        init() {
            this.resize();
            
            // Resize 防抖，避免频繁重绘
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.resize(), 200);
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
                this.ctx.fillStyle = Math.random() > 0.98 ? '#fff' : '#0f0';
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

                if (this.drops[i] * this.fontSize > this.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
        }

        start() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => this.draw(), 50);
        }
    }

    /* =========================================
       BootLoader - Startup Animation
       ========================================= */
    class BootLoader {
        constructor() {
            this.bootScreen = document.getElementById('boot-screen');
            this.logContainer = document.getElementById('boot-log');
            
            this.logs = [
                "Linux version 6.5.0-generic (buildd@lcy02-amd64-032) (gcc version 12.3.0 (Ubuntu 12.3.0-1ubuntu1~22.04)) #41~22.04.2-Ubuntu SMP PREEMPT_DYNAMIC",
                "Command line: BOOT_IMAGE=/boot/vmlinuz-6.5.0-generic root=UUID=1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6 ro quiet splash",
                "x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
                "x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'",
                "x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'",
                "signal: max sigframe size: 1440",
                "BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
                "BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved",
                "BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved",
                "BIOS-e820: [mem 0x0000000000100000-0x00000000bffdffff] usable",
                "NX (Execute Disable) protection: active",
                "SMBIOS 2.8 present.",
                "DMI: Portfolio/VirtualBox, BIOS VirtualBox 12/01/2006",
                "tsc: Fast TSC calibration using PIT",
                "tsc: Detected 2800.000 MHz processor",
                "acpi: Interpreter enabled",
                "acpi: PM Timer IO Port: 0x4008",
                "pci_bus 0000:00: on NUMA node 0",
                "input: Power Button as /devices/LNXSYSTM:00/LNXPWRBN:00/input/input0",
                "input: Sleep Button as /devices/LNXSYSTM:00/LNXSLPBN:00/input/input1",
                "Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled",
                "Non-volatile memory driver v1.3",
                "Linux agpgart interface v0.103",
                "usbcore: registered new interface driver usbfs",
                "usbcore: registered new interface driver hub",
                "usbcore: registered new device driver usb",
                "pci 0000:00:03.0: [8086:100e] type 00 class 0x020000",
                "e1000: Intel(R) PRO/1000 Network Driver - version 7.3.21-k8-NAPI",
                "e1000: Copyright (c) 1999-2006 Intel Corporation.",
                "input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input2",
                "input: ImExPS/2 Generic Explorer Mouse as /devices/platform/i8042/serio1/input/input3",
                "rtc_cmos 00:00: setting system clock to 2026-03-12 15:30:00 UTC (1773329400)",
                "Freeing unused kernel memory: 2048K",
                "Write protecting the kernel read-only data: 10240k",
                "Freeing unused kernel memory: 1024K",
                "Freeing unused kernel memory: 512K",
                "systemd[1]: Inserted module 'autofs4'",
                "systemd[1]: Detected architecture x86-64.",
                "systemd[1]: Set hostname to <portfolio-server>.",
                "[  OK  ] Created slice System Slice.",
                "[  OK  ] Created slice User and Session Slice.",
                "[  OK  ] Started Dispatch Password Requests to Console Directory Watch.",
                "[  OK  ] Reached target Local File Systems (Pre).",
                "[  OK  ] Reached target Local File Systems.",
                "[  OK  ] Reached target Remote File Systems.",
                "[  OK  ] Reached target Swap.",
                "[  OK  ] Reached target Timers.",
                "[  OK  ] Listening on Journal Socket.",
                "[  OK  ] Started Journal Service.",
                "Starting Load/Save Random Seed...",
                "[  OK  ] Started Load/Save Random Seed.",
                "Starting Apply Kernel Variables...",
                "[  OK  ] Started Apply Kernel Variables.",
                "[  OK  ] Started Network Manager.",
                "[  OK  ] Reached target Network.",
                "Starting OpenSSH server...",
                "[  OK  ] Started OpenSSH server.",
                "Mounting /home/user/portfolio...",
                "[  OK  ] Mounted /home/user/portfolio.",
                "[  OK  ] Started Message Bus System.",
                "[  OK  ] Started User Login Management.",
                "[  OK  ] Started ACPI Event Assistant.",
                "[  OK  ] Started Daily Cleanup of Temporary Directories.",
                "[  OK  ] Reached target Multi-User System.",
                "[  OK  ] Reached target Graphical Interface.",
                "Starting Update UTMP about System Runlevel Changes...",
                "[  OK  ] Started Update UTMP about System Runlevel Changes.",
                "Loading kernel modules...",
                "[  OK  ] Loaded module: nvidia_drm.",
                "[  OK  ] Loaded module: nvidia_modeset.",
                "[  OK  ] Loaded module: drm_kms_helper.",
                "Checking file systems...",
                "/dev/sda1: clean, 123456/244124 files, 1234567/488248 blocks",
                "/dev/sdb1: clean, 456789/999999 files, 9876543/1999999 blocks",
                "Initializing random number generator...",
                "[  OK  ] Started Random Number Generator.",
                "Starting Time Synchronization...",
                "[  OK  ] Started Time Synchronization.",
                "[  OK  ] Reached target System Time Synchronized.",
                "Initializing graphics driver...",
                "[  OK  ] Initialized graphics driver.",
                "Loading resources...",
                "Loading assets/pic/1.jpg... [ OK ]",
                "Loading assets/pic/2.jpg... [ OK ]",
                "Loading assets/pic/3.jpg... [ OK ]",
                "Loading assets/pic/4.jpg... [ OK ]",
                "Loading assets/pic/5.jpg... [ OK ]",
                "Loading assets/pic/6.jpg... [ OK ]",
                "Initializing graphical interface...",
                "[  OK  ] Reached target Graphical Interface.",
                "Starting user session...",
                "[  OK  ] Started Session c1 of user root.",
                "Welcome to Portfolio OS 1.0 LTS (GNU/Linux 6.5.0-generic x86_64)",
                "",
                "System load:  0.02               Processes:  123",
                "Usage of /:   15.2% of 50.0GB    Users logged in: 1",
                "Memory usage: 12%                IP address for eth0: 192.168.1.100",
                "",
                "Last login: Thu Mar 12 15:28:00 2026 from 10.0.0.1",
                "Initializing terminal environment...",
                "Done."
            ];
            
            this.currentIndex = 0;
            this.minDuration = 3000;
            this.startTime = Date.now();
            this.isBootComplete = false;
            this.isWindowLoaded = false;
            
            this.spinnerFrames = ['/', '-', '\\', '|'];
            this.spinnerIndex = 0;
            
            window.addEventListener('load', () => { this.isWindowLoaded = true; });
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
                    let spinnerRow = document.getElementById('boot-spinner-row');
                    if (!spinnerRow) {
                         spinnerRow = document.createElement('p');
                         spinnerRow.id = 'boot-spinner-row';
                         const timestamp = ((Date.now() - this.startTime) / 1000).toFixed(6);
                         spinnerRow.innerHTML = `<span class="log-time">[${timestamp}]</span> Verifying system integrity... <span id="spinner" style="font-weight:bold; color:#0f0;">/</span>`;
                         this.logContainer.appendChild(spinnerRow);
                         window.scrollTo(0, document.body.scrollHeight);
                         this.logContainer.scrollTop = this.logContainer.scrollHeight;
                    } else {
                         const spinner = document.getElementById('spinner');
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

            let randomFactor = Math.random() * 0.5 + 0.1; 
            if (Math.random() > 0.9) randomFactor = 5.0;

            setTimeout(() => this.addLog(), 20 * randomFactor);
        }
        
        finish() {
            this.bootScreen.style.opacity = '0';
            setTimeout(() => {
                this.bootScreen.style.display = 'none';
                if (this.onComplete) this.onComplete();
            }, 500); 
        }
    }

    /* =========================================
       Gallery - Photo Grid & Lightbox
       ========================================= */
    class Gallery {
        constructor() {
            this.photoGrid = document.getElementById('photo-grid');
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImg = document.getElementById('lightbox-img');
            this.lightboxCaption = document.getElementById('lightbox-caption');
            this.closeLightbox = document.querySelector('.close-lightbox');
            
            // 从配置读取图片数据，如果未定义则使用空数组
            this.photos = (window.PortfolioConfig && window.PortfolioConfig.photos) ? window.PortfolioConfig.photos : [];

            // 预加载前 3 张图片 (优化首屏体验)
            if (this.photos.length > 0) {
                this.photos.slice(0, 3).forEach(photo => {
                    const img = new Image();
                    img.src = photo.src;
                });
            }

            // 懒加载观察器
            this.observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.onload = () => img.classList.add('loaded');
                            img.removeAttribute('data-src'); // 避免重复处理
                            obs.unobserve(img);
                        }
                    }
                });
            }, {
                root: null, // 视口
                rootMargin: '150%', // 提前预加载1.5个视口高度
                threshold: 0 
            });

            if (this.photoGrid) {
                this.init();
            }
        }

        init() {
            this.renderGrid();
            this.bindLightboxEvents();
            this.bindGridEvents();
        }

        renderGrid() {
            // 使用 DocumentFragment 减少 DOM 重排 (性能优化：批量插入)
            const fragment = document.createDocumentFragment();

            this.photos.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'photo-item';
                item.dataset.index = index; // 用于事件委托定位数据
                
                // 使用占位图 + data-src + 简介覆盖层
                const captionHtml = photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : '';
                
                item.innerHTML = `
                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                         data-src="${photo.src}" 
                         alt="Photo ${index + 1}" 
                         class="lazy"
                         onerror="this.parentElement.style.display='none'">
                    ${captionHtml}
                `;
                
                // 注意：不再为每个 item 单独绑定 click 事件，改为在 photoGrid 上统一委托
                
                fragment.appendChild(item);
                
                // 加入观察列表 (IntersectionObserver 性能很好，可以直接观察)
                const imgEl = item.querySelector('img');
                if (imgEl) this.observer.observe(imgEl);
            });

            this.photoGrid.appendChild(fragment);
        }

        bindGridEvents() {
            // 事件委托：只绑定一个事件监听器处理所有图片点击 (性能优化：减少内存占用)
            this.photoGrid.addEventListener('click', (e) => {
                const item = e.target.closest('.photo-item');
                if (!item) return;

                const index = item.dataset.index;
                if (index !== undefined) {
                    const photo = this.photos[index];
                    const img = item.querySelector('img');
                    // 确保图片已加载且未损坏
                    if (img && img.classList.contains('loaded') && img.naturalHeight !== 0) {
                        this.openLightbox(photo);
                    }
                }
            });
        }

        openLightbox(photo) {
            if (!this.lightboxImg) return;
            this.lightboxImg.src = photo.src;
            
            if (this.lightboxCaption) {
                const text = photo.caption || '';
                this.lightboxCaption.textContent = text;
                this.lightboxCaption.style.display = text ? 'block' : 'none';
            }
            this.lightbox.classList.add('active');
        }

        closeLightboxFunc() {
            if (this.lightbox) {
                this.lightbox.classList.remove('active');
            }
        }

        bindLightboxEvents() {
            if (this.closeLightbox) {
                this.closeLightbox.addEventListener('click', () => this.closeLightboxFunc());
            }
            if (this.lightbox) {
                this.lightbox.addEventListener('click', (e) => {
                    if (e.target === this.lightbox) this.closeLightboxFunc();
                });
            }
        }
    }

    /* =========================================
       App - Main Controller
       ========================================= */
    class App {
        constructor() {
            // UI 元素
            this.terminal = document.getElementById('terminal-container');
            this.gallery = document.getElementById('gallery-container');
            this.resume = document.getElementById('resume-container');
            
            this.textElement = document.getElementById('typewriter-text');
            this.textToType = (window.PortfolioConfig && window.PortfolioConfig.typewriterText) ? 
                              window.PortfolioConfig.typewriterText : 
                              "Code & Capture & Create"; 
            this.charIndex = 0;
            this.typeSpeed = 80;
            
            // 页面切换定时器引用，解决竞态条件
            this.switchTimer = null;
            // 标题轮播定时器
            this.titleInterval = null;
            this.documentTitle = document.title;

            // 实例化子模块
            this.matrixRain = new MatrixRain();
            this.galleryManager = new Gallery();
            this.bootLoader = new BootLoader();

            this.init();
        }

        init() {
            this.bindEvents();
            this.startTitleLoop(); // 启动标题轮播
            
            // 检查 URL 参数 (?to=md 或 ?to=pic)
            const params = new URLSearchParams(window.location.search);
            const toPage = params.get('to');

            if (toPage) {
                // 有跳转参数：跳过 BootLoader，直接显示
                if (this.bootLoader && this.bootLoader.bootScreen) {
                    this.bootLoader.bootScreen.style.display = 'none';
                }
                
                // 立即显示打字机文字
                if (this.textElement) {
                    this.textElement.textContent = this.textToType;
                }
                
                // 启动 Uptime
                this.updateUptime();
                setInterval(() => this.updateUptime(), 1000);

                // 执行跳转
                if (toPage === 'md') {
                    this.switchPage('resume-container');
                } else if (toPage === 'pic') {
                    this.switchPage('gallery-container');
                }
            } else {
                // 无参数：正常启动 Boot 动画
                if (this.bootLoader) {
                    this.bootLoader.start(() => {
                        this.onBootComplete();
                    });
                } else {
                    this.onBootComplete();
                }
            }
        }

        startTitleLoop() {
            this.stopTitleLoop();
            // 从配置读取标题，如果没有则使用默认值
            const titles = (window.PortfolioConfig && window.PortfolioConfig.titles) ? 
                           window.PortfolioConfig.titles : 
                           ['Portfolio', 'Developer'];
            
            let i = 0;
            // 立即设置
            document.title = titles[0];

            this.titleInterval = setInterval(() => {
                i = (i + 1) % titles.length;
                document.title = titles[i];
            }, 3000);
        }

        stopTitleLoop() {
            if (this.titleInterval) {
                clearInterval(this.titleInterval);
                this.titleInterval = null;
            }
        }

        onBootComplete() {
            if (this.textElement) {
                setTimeout(() => this.typeWriter(), 800);
            }
            
            // 启动 Uptime 计时器
            this.updateUptime();
            setInterval(() => this.updateUptime(), 1000);
        }

        updateUptime() {
            const uptimeEl = document.getElementById('system-uptime');
            if (!uptimeEl) return;

            const startTime = new Date('2021-07-01T00:00:00');
            const now = new Date();
            const diff = now - startTime;

            const totalSeconds = Math.floor(diff / 1000);
            
            const years = Math.floor(totalSeconds / (365 * 24 * 3600));
            let remainingSeconds = totalSeconds % (365 * 24 * 3600);
            
            const days = Math.floor(remainingSeconds / (24 * 3600));
            remainingSeconds = remainingSeconds % (24 * 3600);
            
            const hours = Math.floor(remainingSeconds / 3600);
            remainingSeconds = remainingSeconds % 3600;
            
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;

            uptimeEl.textContent = `System Uptime: ${years} Years ${days} Days ${hours} Hours ${minutes} Mins ${seconds} Secs`;
        }

        typeWriter() {
            if (this.charIndex < this.textToType.length) {
                this.textElement.textContent += this.textToType.charAt(this.charIndex);
                this.charIndex++;
                setTimeout(() => this.typeWriter(), this.typeSpeed);
            }
        }

        switchPage(showId) {
            // 1. 清除之前的定时器，防止 hidden 类被错误添加导致页面空白
            if (this.switchTimer) {
                clearTimeout(this.switchTimer);
                this.switchTimer = null;
            }

            const pages = [this.terminal, this.gallery, this.resume];
            const showEl = document.getElementById(showId);

            // 2. 立即更新所有页面的可视状态
            pages.forEach(el => {
                if (!el) return;
                
                if (el === showEl) {
                    // 目标页面：立即移除 hidden，开始淡入
                    el.classList.remove('hidden');
                    // 恢复交互能力
                    el.style.pointerEvents = 'auto'; 
                    
                    void el.offsetWidth; // Force reflow
                    
                    el.style.opacity = '1';
                    if (el === this.terminal) el.style.transform = 'scale(1)';
                    else el.classList.add('active'); 

                    if (el !== this.terminal) el.scrollTop = 0;
                } else {
                    // 非目标页面：开始淡出（如果尚未隐藏）
                    // 即使已经在淡出中，也重新确认 opacity 为 0
                    if (!el.classList.contains('hidden')) {
                        el.style.opacity = '0';
                        // 关键：立即禁用交互，防止在淡出动画期间遮挡下层元素
                        el.style.pointerEvents = 'none';
                        
                        if (el === this.terminal) el.style.transform = 'scale(0.95)';
                        else el.classList.remove('active');
                    }
                }
            });

            // 3. 设置新的定时器，在动画结束后将非目标页面设为 hidden
            this.switchTimer = setTimeout(() => {
                pages.forEach(el => {
                    if (el && el !== showEl && !el.classList.contains('hidden')) {
                        el.classList.add('hidden');
                    }
                });
                this.switchTimer = null;
            }, 500);
        }

        bindEvents() {
            const btnOpenGallery = document.getElementById('btn-open-gallery');
            const btnOpenResume = document.getElementById('btn-open-resume');
            const btnCloseResume = document.getElementById('btn-close-resume');
            const btnCloseGallery = document.getElementById('btn-close-gallery');

            if (btnOpenGallery) {
                btnOpenGallery.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchPage('gallery-container');
                });
            }

            if (btnOpenResume) {
                btnOpenResume.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchPage('resume-container');
                });
            }

            if (btnCloseResume) {
                btnCloseResume.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchPage('terminal-container');
                });
            }
            
            if (btnCloseGallery) {
                btnCloseGallery.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchPage('terminal-container');
                });
            }

            // Tab Visibility Change (标题彩蛋)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopTitleLoop();
                    document.title = '[System Suspended] Connection Lost...';
                } else {
                    document.title = this.documentTitle;
                    this.startTitleLoop();
                }
            });

            // Back To Top Button Logic
            const setupBackToTop = (container, btnId) => {
                const btn = document.getElementById(btnId);
                if (!container || !btn) return;
                
                container.addEventListener('scroll', () => {
                    if (container.scrollTop > 300) {
                        btn.classList.add('visible');
                    } else {
                        btn.classList.remove('visible');
                    }
                });
                
                btn.addEventListener('click', () => {
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                });
            };

            setupBackToTop(this.resume, 'back-to-top-resume');
            setupBackToTop(this.gallery, 'back-to-top-gallery');

            // ESC 键返回终端
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // 如果 Lightbox 打开，先关闭 Lightbox
                    if (this.galleryManager && 
                        this.galleryManager.lightbox && 
                        this.galleryManager.lightbox.classList.contains('active')) {
                        this.galleryManager.closeLightboxFunc();
                        return;
                    }
                    // 否则返回终端主页
                    this.switchPage('terminal-container');
                }
            });
        }
    }

    // 启动应用
    document.addEventListener('DOMContentLoaded', () => {
        new App();
        
        // 禁止右键和复制
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        // document.addEventListener('keydown', (e) => {
        //     if (e.key === 'F12' || 
        //         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
        //         (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P'))) {
        //         e.preventDefault();
        //     }
        // });
        document.addEventListener('copy', (e) => e.preventDefault());
    });

})();
