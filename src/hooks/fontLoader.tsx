import { useEffect, useState } from 'react';

const useFontLoader = (): boolean => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const fontPromises: Promise<FontFace>[] = [];

        const fonts = [
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/NotoSansTamil-Bold.woff2',
                    '/assets/font/NotoSansTamil-Bold.woff',
                    '/assets/font/NotoSansTamil-Bold.ttf',
                ],
                params: { weight: 'bold' }
            },
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/NotoSansTamil-SemiBold.woff2',
                    '/assets/font/NotoSansTamil-SemiBold.woff',
                    '/assets/font/NotoSansTamil-SemiBold.ttf',
                ],
                params: { weight: '600' }
            },
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/NotoSansTamil-Medium.woff2',
                    '/assets/font/NotoSansTamil-Medium.woff',
                    '/assets/font/NotoSansTamil-Medium.ttf',
                ],
                params: { weight: '500' }
            },
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/NotoSansTamil-Regular.woff2',
                    '/assets/font/NotoSansTamil-Regular.woff',
                    '/assets/font/NotoSansTamil-Regular.ttf',
                ],
                params: { weight: 'normal' }
            },
            {
                family: 'KG Blank Space Solid',
                sources: [
                    '/assets/font/KGBlankSpaceSolid.woff2',
                    '/assets/font/KGBlankSpaceSolid.woff',
                    '/assets/font/KGBlankSpaceSolid.ttf',
                ],
                params: { weight: 'normal' }
            }
        ];

        fonts.forEach(font => {
            font.sources.forEach(source => {
                const fontFace = new FontFace(font.family, `url(${source})`, font.params);
                fontPromises.push(fontFace.load());
            });
        });

        Promise.all(fontPromises).then(loadedFonts => {
            loadedFonts.forEach(font => document.fonts.add(font));
            setFontsLoaded(true);
        }).catch(() => {
            setFontsLoaded(true); // Set fontsLoaded to true even if there's an error
        });
    }, []);

    return fontsLoaded;
};

export default useFontLoader;
