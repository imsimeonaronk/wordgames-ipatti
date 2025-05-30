import { useEffect, useState } from 'react';

const useFontLoader = (): boolean => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const fontPromises: Promise<FontFace>[] = [];

        const fonts = [
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/native/NotoSansTamil-Bold.woff2',
                    '/assets/font/native/NotoSansTamil-Bold.woff',
                    '/assets/font/native/NotoSansTamil-Bold.ttf',
                ],
                params: { weight: 'bold' }
            },
            {
                family: 'Noto Sans Tamil',
                sources: [
                    '/assets/font/native/NotoSansTamil-Regular.woff2',
                    '/assets/font/native/NotoSansTamil-Regular.woff',
                    '/assets/font/native/NotoSansTamil-Regular.ttf',
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
