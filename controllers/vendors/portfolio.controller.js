import Portfolio from "../../models/Portfolio.js";
import PortfolioMedia from "../../models/PortfolioMedia.js";

export const createPortfolio = async (req, res) => {
  try {

    const { title, category, subCategory, description, status } = req.body;

    const portfolio = await Portfolio.create({
      userId: req.user.id,
      title,
      category,
      subCategory,
      description,
      status,
    });

    const media = req.files.map(file => ({
      portfolioId: portfolio.id,
      type: file.mimetype.startsWith("video") ? "video" : "image",
      url: `/uploads/portfolio/${file.filename}`
    }));

    if (media.length) {
      await PortfolioMedia.bulkCreate(media);
    }

    res.status(201).json({ message: "Portfolio created", portfolio });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyPortfolios = async (req, res) => {
  const { search, category, subCategory } = req.query;

  const where = { userId: req.user.id };

  if (category && category !== "All") where.category = category;
  if (subCategory && subCategory !== "All") where.subCategory = subCategory;

  const portfolios = await Portfolio.findAll({
    where,
    include: [PortfolioMedia],
    order: [["createdAt", "DESC"]],
  });

  res.json(portfolios);
};


export const updatePortfolio = async (req, res) => {
  const { id } = req.params;

  const portfolio = await Portfolio.findOne({
    where: { id, userId: req.user.id },
  });

  if (!portfolio) {
    return res.status(404).json({ message: "Portfolio not found" });
  }

  await portfolio.update(req.body);

  res.json({ message: "Portfolio updated" });
};


export const togglePortfolioStatus = async (req, res) => {
  const portfolio = await Portfolio.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  portfolio.status = portfolio.status === "active" ? "inactive" : "active";
  await portfolio.save();

  res.json({ status: portfolio.status });
};


export const deletePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!portfolio) {
    return res.status(404).json({ message: "Not found" });
  }

  await portfolio.destroy();
  res.json({ message: "Portfolio deleted" });
};


