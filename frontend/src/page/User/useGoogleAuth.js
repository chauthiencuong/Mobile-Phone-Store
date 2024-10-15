import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const useGoogleAuth = () => {
    useEffect(() => {
        const initClient = () => {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    clientId: '1078815739832-nbppi9iif8s468b42j8s8t7vogcncm3h.apps.googleusercontent.com',
                    scope: 'profile email',
                });
            });
        };

        initClient();
    }, []);
};

export default useGoogleAuth;
