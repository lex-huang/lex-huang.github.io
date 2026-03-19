/**
 * Portfolio Configuration
 * 集中管理网站数据，方便维护
 */
(function() {
    const CDN_PREFIX = 'https://cdn.jsdmirror.com/gh/lex-huang/lex-huang.github.io/';
    // const CDN_PREFIX = '';

    window.PortfolioConfig = {
        // 终端打字机文案
        typewriterText: 'Code & Capture & Create',

        // 浏览器标签页标题轮播列表
        titles: [
            'Lex\'s Portfolio', 
            'Java Developer', 
            'Photographer', 
            'Gamer'
        ],

        // 相册图片数据
        // src: 图片路径 (自动拼接 CDN 前缀)
        // caption: 悬停显示的简介 (可选)
        photos: [
            { src: CDN_PREFIX + 'pic/1.jpg', caption: '樱花' },
            { src: CDN_PREFIX + 'pic/2.jpg', caption: '春日气息' },
            { src: CDN_PREFIX + 'pic/3.jpg', caption: '落花椅' },
            { src: CDN_PREFIX + 'pic/4.jpg', caption: '天地一隅' },
            { src: CDN_PREFIX + 'pic/5.jpg', caption: '深蓝' },
            { src: CDN_PREFIX + 'pic/6.jpg', caption: '银色穿梭' }
        ]
    };
})();
