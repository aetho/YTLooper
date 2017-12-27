let loopBTN = $(`
<button class="ytp-loop-button ytp-button" aria-pressed="false" title="Loop" style="text-align: center;">
    <svg fill="#fff" version="1.1" viewBox="0 0 30 30" height="100%" style="margin: auto; position: relative; top: 3px; left: 2px;" width="70%">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path>
    </svg>
</button>
`);

$('.ytp-right-controls').ready(function () {
    $('.ytp-right-controls').prepend(loopBTN);
    let looping = false;
    $('.ytp-loop-button').attr('aria-pressed', `${looping}`);

    $('.ytp-loop-button').on('click', (e) => {
        looping = !looping;
        $('.ytp-loop-button').attr('aria-pressed', `${looping}`);
        console.log('looping:', looping);
    });

    let video = $('.video-stream');

    // console.log('video:', video);

    let v = video.get(0);
    let lower = 0;
    let upper = v.duration;

    video.on('durationchange', e => {
        lower = 0;
        upper = v.duration;
    });

    video.on('timeupdate', e => {
        // console.log('time:', v.currentTime);
        if (!looping) return;
        if (v.currentTime > upper - 0.1) v.currentTime = lower;
        if (v.currentTime < lower) v.currentTime = lower;
    });

    video.on('seeked', e => {
        v.play();
    });

    video.on('ended', e => {
        // console.log('ENDED');
        if (looping) v.currentTime = lower;
    });
});