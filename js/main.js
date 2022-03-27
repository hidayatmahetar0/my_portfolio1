jQuery(document).ready(function($) {

    'use strict';

    $(window).load(function() { // makes sure the whole site is loaded
        $(".seq-preloader").fadeOut(); // will first fade out the loading animation
        $(".sequence").delay(500).fadeOut("slow"); // will fade out the white DIV that covers the website.
    })


    $(function() {

        function showSlide(n) {
            // n is relative position from current slide

            // unbind event listener to prevent retriggering
            $body.unbind("mousewheel");

            // increment slide number by n and keep within boundaries
            currSlide = Math.min(Math.max(0, currSlide + n), $slide.length - 1);

            var displacment = window.innerWidth * currSlide;
            // translate slides div across to appropriate slide
            $slides.css('transform', 'translateX(-' + displacment + 'px)');
            // delay before rebinding event to prevent retriggering
            setTimeout(bind, 700);

            // change active class on link
            $('nav a.active').removeClass('active');
            $($('a')[currSlide]).addClass('active');

        }

        function bind() {
            $body.bind('false', mouseEvent);
        }

        function mouseEvent(e, delta) {
            // On down scroll, show next slide otherwise show prev slide
            showSlide(delta >= 0 ? -1 : 1);
            e.preventDefault();
        }

        $('nav a, .main-btn a').click(function(e) {
            // When link clicked, find slide it points to
            var newslide = parseInt($(this).attr('href')[1]);
            // find how far it is from current slide
            var diff = newslide - currSlide - 1;
            showSlide(diff); // show that slide
            e.preventDefault();
        });

        $(window).resize(function() {
            // Keep current slide to left of window on resize
            var displacment = window.innerWidth * currSlide;
            $slides.css('transform', 'translateX(-' + displacment + 'px)');
        });

        // cache
        var $body = $('body');
        var currSlide = 0;
        var $slides = $('.slides');
        var $slide = $('.slide');

        // give active class to first link
        $($('nav a')[0]).addClass('active');

        // add event listener for mousescroll
        $body.bind('false', mouseEvent);
    })


    $('#form-submit .date').datepicker({});


    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 100) {
            $(".header").addClass("active");
        } else {
            //remove the background property so it comes transparent again (defined in your css)
            $(".header").removeClass("active");
        }
    });


});

// latter




Letters = function() {
    this.lettersDOM = null;
    this.active = null;
    this.letters = [];
    this.alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "i", "u", "v", "w", "x", "y", "z", "~", "&", "|", "^", "ç", "@", "]", "[", "{", "}", "ù", "*", "µ", "¤", "$", "£", "€", "°", ")", "(", "+", "-", "/", "<", ">", "²", "`", "é", "è", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    return this;
};

Letters.prototype.init = function(word) {

    this.lettersDOM = document.querySelectorAll('.letter');
    this.active = true;
    var i;
    var nextChar;
    var lettersMax = this.lettersDOM.length;

    for (i = 0; i < this.lettersDOM.length; i++) {

        if (word.charAt(i) != "")
            nextChar = word.charAt(i);
        else
            nextChar = false;

        this.letters.push(new Letter(this.lettersDOM[i], nextChar));

    }

    if (word.length > lettersMax) {

        var wordContainer = document.getElementById("word");

        for (i = lettersMax; i < word.length; i++) {
            var letterSpan = document.createElement('span');
            letterSpan.innerHTML = "";
            letterSpan.classList.add('letter');
            wordContainer.appendChild(letterSpan);
            this.letters.push(new Letter(letterSpan, word.charAt(i)));
        }
    }

    this.animate();

    return this;

};

Letters.prototype.animate = function() {
    var i;
    var random;
    var char;

    if (this.active) {

        window.requestAnimationFrame(this.animate.bind(this));

        var indexes = [];

        for (i = 0; i < this.letters.length; i++) {

            var current = this.letters[i];

            if (!current.isDead) {
                random = Math.floor(Math.random() * (this.alphabet.length - 0));
                char = this.alphabet[random];
                current.render(char);
            } else {
                indexes.push(i);
            }
        }

        for (i = 0; i < indexes.length; i++) {
            this.letters.splice(indexes[i], 1);
        }

        if (this.letters.length == 0) {
            this.stop();
        }
    }
};

Letters.prototype.start = function(word) {
    this.init(word);
};

Letters.prototype.stop = function() {
    this.active = false;
};

Letter = function(DOMElement, nextChar) {

    var scope = this;

    this.DOMEl = DOMElement;
    this.char = DOMElement.innerHTML;
    this.next = nextChar;
    this.speed = Math.floor(Math.random() * (300 - 50));
    this.total = 0;
    this.duration = 2000;
    this.animating = true;
    this.isDead = false;

    this.timer = setInterval(function() {
        if (scope.animating === true) {
            scope.total += scope.speed;
        }
        scope.animating = !scope.animating;
    }, this.speed);

    this.animate();

    return this;

};

Letter.prototype.animate = function() {
    var i;
    var random;

    if (!this.isDead) {
        window.requestAnimationFrame(this.animate.bind(this));
    }


    if (this.total < this.duration) {

        if (this.animating) {
            this.DOMEl.innerHTML = this.char;
        }

    } else {
        this.isDead = true;

        if (!this.next) {
            var parent = document.getElementById('word');
            parent.removeChild(this.DOMEl);
            return;
        }

        this.DOMEl.innerHTML = this.next;
    }
};

Letter.prototype.render = function(char) {

    if (!this.animating) {
        this.char = char;
    }

};

var word = ["Hidayat Mahetar", "Hidayat", "Mahetar"];
var nextWord = 1;

var letters = new Letters();

setTimeout(function() {

    letters.start(word[nextWord]);

    setInterval(function() {
        nextWord++;
        if (nextWord >= word.length)
            nextWord = 0;

        letters.start(word[nextWord]);
    }, 10000);

}, 2000);