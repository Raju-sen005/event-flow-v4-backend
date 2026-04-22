// controllers/template.controller.js
export const getTemplates = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Wedding Classic",
      thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
      canvaUrl:
        "https://www.canva.com/design/DAHHmB-hNrM/qojngsKB83UtARZ4x726aQ/edit",
    },
  ]);
};
