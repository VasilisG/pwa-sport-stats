if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(registration){
        console.log('serviceWorker registered: ', registration);
    }, function(error){
        console.log('Could not registered service worker: ', error);
    });
}
else console.log('serviceWorker not in navigator.');