import { loadOml2d } from 'oh-my-live2d';
import { useEffect } from 'react';
export const Live2D = () => {
    useEffect(() => {
        loadOml2d({
            models: [
                {
                    path: '/kei_basic_free/runtime/kei_basic_free.model3.json'
                }
            ],
            initialStatus: 'sleep',
            parentElement: document.body,
            sayHello: true,
            tips: (_, currentIndex) => {
                return {
                    copyTips: {
                        message: ['复制了啥?']
                    },
                    idleTips: {
                        wordTheDay: true
                    }
                }
            },
            transitionTime: 1000,
        });
    }, []);

    return <div id="live2d-widget" />;
}