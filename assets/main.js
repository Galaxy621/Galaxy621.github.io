var mode = "clock";
var stop_paused = false;
var stop_start_time = 0;
var stop_time_elapsed = 0;

var timer_editing = true;
var timer_finished = false;
var timer_paused = false;
var timer_paused_elapsed = 0;
var to_timer = "";
var timer_target = 0;

const modes = {
    "clock": $("#clock-button"),
    "stopwatch": $("#stopwatch-button"),
    "timer": $("#timer-button")
}

function clear() {
    $("#milli").text("000");
    $("#sec").text("00");
    $("#min").text("00");
    $("#hour").text("00");
}

function update_clock() {
    const currentTime = new Date();

    const now = currentTime.getTime();
    const secs = currentTime.getSeconds();
    const mins = currentTime.getMinutes();
    const hours = currentTime.getHours();

    $("#milli").text(Math.floor(now % 1000) > 99 ? Math.floor(now % 1000) : Math.floor(now % 1000) > 9 ? `0${Math.floor(now % 1000)}` : `00${Math.floor(now % 1000)}`);
    $("#sec").text(secs > 9 ? secs : `0${secs}`);
    $("#min").text(mins > 9 ? mins : `0${mins}`);
    $("#hour").text(hours > 9 ? hours : `0${hours}`);
}

function update_stopwatch() {
    if (stop_paused) return;
    const now = Date.now() - stop_start_time;

    const secs = Math.floor(now / 1000) % 60;
    const mins = Math.floor(now / 1000 / 60) % 60;
    const hours = Math.floor(now / 1000 / 60 / 60) % 24;

    $("#milli").text(Math.floor(now % 1000) > 99 ? Math.floor(now % 1000) : Math.floor(now % 1000) > 9 ? `0${Math.floor(now % 1000)}` : `00${Math.floor(now % 1000)}`);
    $("#sec").text(secs > 9 ? secs : `0${secs}`);
    $("#min").text(mins > 9 ? mins : `0${mins}`);
    $("#hour").text(hours > 9 ? hours : `0${hours}`);
}

function update_timer() {

    if (timer_editing) {

        var temp_timer = to_timer.padStart(6, "0");
        const hours = parseInt(temp_timer.slice(0, 2));
        const mins = parseInt(temp_timer.slice(2, 4));
        const secs = parseInt(temp_timer.slice(4, 6));
    
        $("#hour").text(hours > 9 ? hours : `0${hours}`);
        $("#min").text(mins > 9 ? mins : `0${mins}`);
        $("#sec").text(secs > 9 ? secs : `0${secs}`);
        $("#milli").text("000");

        return;

    }

    if (timer_paused) return;

    const now = timer_target - Date.now();

    const secs = Math.floor(now / 1000) % 60;
    const mins = Math.floor(now / 1000 / 60) % 60;
    const hours = Math.floor(now / 1000 / 60 / 60) % 24;

    $("#milli").text(Math.floor(now % 1000) > 99 ? Math.floor(now % 1000) : Math.floor(now % 1000) > 9 ? `0${Math.floor(now % 1000)}` : `00${Math.floor(now % 1000)}`);
    $("#sec").text(secs > 9 ? secs : `0${secs}`);
    $("#min").text(mins > 9 ? mins : `0${mins}`);
    $("#hour").text(hours > 9 ? hours : `0${hours}`);

    if (now <= 0) {
        clear();

        if (!timer_finished) console.log("Timer finished!");
        timer_finished = true;
        stop_timer();

        return;
    }
}

function stop_timer() {
    $("#timer-controls").css("display", "none");
    if (mode == "timer") $("#timer-setup-controls").css("display", "block");

    timer_editing = true;
    timer_paused = false;
    to_timer = "";
}

function pause_timer() {
    timer_paused = true;
    timer_paused_elapsed = timer_target - Date.now();

    $("#timer-play-icon").css("display", "inline");
    $("#timer-pause-icon").css("display", "none");
}

function unpause_timer() {
    timer_paused = false;
    timer_target = Date.now() + timer_paused_elapsed;

    $("#timer-play-icon").css("display", "none");
    $("#timer-pause-icon").css("display", "inline");
}

function start_timer() {
    $("#timer-controls").css("display", "flex");
    $("#timer-setup-controls").css("display", "none");

    $("#timer-play-icon").css("display", "none");
    $("#timer-pause-icon").css("display", "inline");

    mode = "timer";
    to_timer = "";
    timer_finished = false;
    timer_editing = false;
    timer_paused = false;
}

function start_stopwatch(clear = false) {
    if (clear) stop_time_elapsed = 0;

    $("#stopwatch-play-icon").css("display", "none");
    $("#stopwatch-pause-icon").css("display", "inline");

    stop_start_time = Date.now() - stop_time_elapsed;
    stop_time_elapsed = 0;
    stop_paused = false;
    mode = "stopwatch";
}

function pause_stopwatch() {
    $("#stopwatch-play-icon").css("display", "inline");
    $("#stopwatch-pause-icon").css("display", "none");

    stop_paused = true;
    stop_time_elapsed = Date.now() - stop_start_time;
}

function stop_stopwatch() {
    $("#stopwatch-play-icon").css("display", "inline");
    $("#stopwatch-pause-icon").css("display", "none");

    stop_paused = true;
    stop_time_elapsed = 0;
    clear();
}

function update() {
    document.title = $("#hour").text() + ":" + $("#min").text() + ":" + $("#sec").text();
    
    switch (mode) {
        case "clock":
            update_clock();
            break;
        case "stopwatch":
            update_stopwatch();
            break;
        case "timer":
            update_timer();
            break;
    }    
}

function change_mode(new_mode) {
    mode = new_mode;
    stop_paused = true;
    
    $("#stopwatch-controls").css("display", new_mode == "stopwatch" ? "flex" : "none");
    $("#timer-setup-controls").css("display", new_mode == "timer" ? "block" : "none");
    $("#timer-controls").css("display", "none");

    stop_stopwatch();
    stop_timer();

    for (const mode in modes) {
        modes[mode].removeClass("selected");
    }

    modes[new_mode].addClass("selected");
}

$("#start-stopwatch").on("click", function() {
    if (stop_paused) {
        start_stopwatch();
    } else {
        pause_stopwatch();
    }
});

$("#reset-stopwatch").on("click", stop_stopwatch);

$("#clock-button").on("click", function() {
    change_mode("clock");
});

$("#stopwatch-button").on("click", function() {
    change_mode("stopwatch");
});

$("#timer-button").on("click", function() {
    change_mode("timer");
});

$("#timer-clear").on("click", function() {
    to_timer = "";
    clear();
});

$("#start-timer").on("click", function() {
    if (timer_editing) return;

    if (timer_paused) {
        unpause_timer();
    } else {
        pause_timer();
    }
});

$("#reset-timer").on("click", function() {
    stop_timer();
});

$("#timer-start").on("click", function() {
    if (to_timer.length == 0) return;

    // to_timer is in the format HHMMSS
    // there may only be minutes, or even just seconds
    // pad it on the left
    to_timer = to_timer.padStart(6, "0");
    console.log(to_timer);

    const hours = parseInt(to_timer.slice(0, 2));
    const mins = parseInt(to_timer.slice(2, 4));
    const secs = parseInt(to_timer.slice(4, 6));

    const now = Date.now();
    timer_target = now + (hours * 60 * 60 * 1000) + (mins * 60 * 1000) + (secs * 1000);
    start_timer();
});

setInterval(update, 1);
change_mode("clock");

for (let i = 0; i < 10; i++) {
    const timer_button = $(`#timer-${i}`);

    timer_button.on("click", function() {
        if (to_timer.length >= 6) return;
        to_timer += `${i}`;
    });
}