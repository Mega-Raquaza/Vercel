module.exports = {
  theme: {
    extend: {
      animation: {
        flip: "flip 1s ease-in-out",
        fade: "fade 1s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
};