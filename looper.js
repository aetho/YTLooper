// let isInjecting = false;
let timer = setInterval(function () {
    console.log($('.ytp-right-controls').length, $('.video-stream').length);
    if ($('.ytp-right-controls').length > 0 && $('.video-stream').length > 0) {
        Inject();
        clearInterval(timer);
    }
}, 250);

function Inject() {
    $('.ytp-right-controls').ready(function () {
        console.log('RIGHT CONTROLS:', $('.ytp-right-controls'));
        // Inject loop button
        $(`
            <button class="ytp-loop-button ytp-button" aria-pressed="false" title="Loop" style="text-align: center;" aria-haspopup="true" aria-owns="ytp-id-loop">
                <svg fill="#fff" version="1.1" viewBox="0 0 30 30" height="100%" style="margin: auto; position: relative; top: 3px; left: 2px;" width="70%">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path>
                </svg>
            </button>
            `).prependTo('.ytp-right-controls');

        // Inject loop settings menu
        $(`
            <div class="ytp-popup ytp-looping-menu" style="width: 200px; height: 120px; display: none;" id="ytp-id-loop">
                <div class="ytp-panel" style="width: 200px; height: 120px;">
                    <div class="ytp-panel-menu" role="menu" style="height: 112px;">
                        <div class="ytp-menuitem" role="menuitemcheckbox" aria-checked="false" tabindex="0" id="toggle-loop-item">
                            <div class="ytp-menuitem-label">Looping</div>
                            <div class="ytp-menuitem-content">
                                <div class="ytp-menuitem-toggle-checkbox" id="toggle-loop"></div>
                            </div>
                        </div>
                        <div class="ytp-menuitem" aria-haspopup="false" role="menuitem" tabindex="0">
                            <div class="ytp-menuitem-label">Start</div>
                            <div class="ytp-menuitem-content">
                                <input id="loop-start" class="loop-input" type="text" placeholder="Seconds">
                            </div>
                        </div>
                        <div class="ytp-menuitem" aria-haspopup="false" role="menuitem" tabindex="0">
                            <div class="ytp-menuitem-label">End</div>
                            <div class="ytp-menuitem-content">
                                <input id="loop-end" class="loop-input" type="text" placeholder="Seconds">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `).insertAfter('.ytp-right-controls');

        $('.video-stream').ready(function () {
            console.log('video-stream:', $('.video-stream'));
            // Initialise bounds
            let video = $('.video-stream');
            let v = video.get(0);
            let lower = 0;
            let upper = v.duration;

            // Initialise looping settings
            let looping = false;
            $('.ytp-loop-button').attr('aria-pressed', `${looping}`);
            $('#toggle-loop-item').attr('aria-checked', `${looping}`);
            $('#loop-start').val(lower);
            $('#loop-end').val(upper);

            $('.ytp-loop-button').on('click', (e) => {
                // Toggle looping settings menu
                $('#ytp-id-loop').toggle();
            });

            $('#toggle-loop').on('click', (e) => {
                looping = !looping;
                // Visually update checkbox
                $('#toggle-loop-item').attr('aria-checked', `${looping}`);

                // Visually update icon
                $('.ytp-loop-button').attr('aria-pressed', `${looping}`);

                // Visually update inputs (disable/enable them)
                $('#loop-start').prop('disabled', looping);
                $('#loop-end').prop('disabled', looping);
            });

            $('#loop-start').on('dblclick', (e) => {
                $('#loop-start').val(v.currentTime);
            });

            $('#loop-end').on('dblclick', (e) => {
                $('#loop-end').val(v.currentTime);
            });

            $('#loop-start, #loop-end').on('keypress', (e) => {
                e.preventDefault();
            });

            video.on('durationchange', (e) => {
                // Reset Upper & Lower bounds on video/duration change
                lower = 0;
                upper = v.duration;
                $('#loop-start').val(lower);
                $('#loop-end').val(upper);
            });

            video.on('timeupdate', (e) => {
                // Seek to Lower bound if over Upper bound or under Lower Bound
                if (!looping) return;
                lower = $('#loop-start').val() || 0;
                upper = $('#loop-end').val() || v.duration;
                if (v.currentTime > upper - 0.1) v.currentTime = lower;
                if (v.currentTime < lower) v.currentTime = lower;
            });

            video.on('seeked', (e) => {
                // Play when seeking finishes
                v.play();
            });

            video.on('ended', e => {
                // Seek to Lower bound when video ends (for when lower bound is set but no upper bound)
                if (looping) v.currentTime = lower;
            });
        });
    });
};