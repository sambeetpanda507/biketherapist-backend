module.exports.postPosts = async (req, res, next) => {
  try {
    const { name } = req.body;
    res.status(200).json({ name });
  } catch (err) {
    console.error(err);
  }
};
