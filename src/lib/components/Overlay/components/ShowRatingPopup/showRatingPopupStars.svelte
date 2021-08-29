<div class="star-wrapper" data-name="air">
    <span class="star" data-rating="5"></span>
    <span class="star" data-rating="4"></span>
    <span class="star" data-rating="3"></span>
    <span class="star" data-rating="2"></span>
    <span class="star" data-rating="1"></span>
</div>

<style>
    .star-wrapper {
        display: inline-flex;

        margin: 15px 0 2px;

        flex-direction: row-reverse;
        text-align: left;
    }

    .star {
        padding: 0 10px 0 0;

        font-size: 34px;
        font-family: 'star__icon' !important;
        speak: never;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--non-active-color);
        text-decoration: none;

        transition: all 0.5s;
    }

    .star::before {
        content: "\e900";
    }

    .star-wrapper a:hover,
    .star-wrapper a:focus {
        transform: scale(1.3);
    }

    .s1:hover ~ a,
    .s1:focus ~ a,
    .s1:focus,
    .s1:hover {
        color: #04AC29;
        color: var(--suc-color);
    }

    .s2:hover ~ a,
    .s2:focus ~ a,
    .s2:focus,
    .s2:hover {
        color: #62AC04;
    }

    .s3:hover ~ a,
    .s3:focus ~ a,
    .s3:focus,
    .s3:hover {
        color: #A9AC04;
    }

    .s4:hover ~ a,
    .s4:focus ~ a,
    .s4:focus,
    .s4:hover {
        color: #DEC806;
    }

    .s5:hover ~ a,
    .s5:focus ~ a,
    .s5:focus,
    .s5:hover {
        color: #D05A04;
    }

    .star-active,
    .star-active ~ span,
    .star-active ~ a {
        color: var(--active-color);
    }
</style>
