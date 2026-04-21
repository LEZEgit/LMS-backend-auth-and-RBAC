import { prisma } from "../config/db.js";

const createVisit = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const visit = await prisma.visit.create({
    data: { name, userId },
  });

  res.status(201).json({ status: "success", data: { visit } });
};

const getVisits = async (req, res) => {
  const userId = req.user.id;

  const visits = await prisma.visit.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ status: "success", data: { visits } });
};

const getVisit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const visit = await prisma.visit.findFirst({
    where: { id, userId },
    include: {
      items: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              ISBN: true,
              categories: true,
              thumbnail_url: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!visit) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  res.status(200).json({ status: "success", data: { visit } });
};

const updateVisit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, status } = req.body;

  const existing = await prisma.visit.findFirst({ where: { id, userId } });
  if (!existing) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (status !== undefined) data.status = status;

  const visit = await prisma.visit.update({
    where: { id },
    data,
  });

  res.status(200).json({ status: "success", data: { visit } });
};

const deleteVisit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = await prisma.visit.findFirst({ where: { id, userId } });
  if (!existing) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  await prisma.visit.delete({ where: { id } });

  res.status(200).json({ status: "success", message: "Visit deleted" });
};

const addVisitItem = async (req, res) => {
  const { id } = req.params;
  const { bookId, notes } = req.body;
  const userId = req.user.id;

  const visit = await prisma.visit.findFirst({ where: { id, userId } });
  if (!visit) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    error.code = "BOOK_NOT_FOUND";
    throw error;
  }

  try {
    const item = await prisma.visitItem.create({
      data: { visitId: id, bookId, notes },
    });

    res.status(201).json({ status: "success", data: { item } });
  } catch (error) {
    if (error.code === "P2002") {
      const prismaError = new Error("Book already in this visit list");
      prismaError.status = 400;
      prismaError.code = "DUPLICATE_VISIT_ITEM";
      throw prismaError;
    }
    throw error;
  }
};

const updateVisitItem = async (req, res) => {
  const { id, itemId } = req.params;
  const { notes, checked } = req.body;
  const userId = req.user.id;

  const visit = await prisma.visit.findFirst({ where: { id, userId } });
  if (!visit) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  const data = {};
  if (notes !== undefined) data.notes = notes;
  if (checked !== undefined) data.checked = checked;

  try {
    const item = await prisma.visitItem.update({
      where: { id: itemId, visitId: id },
      data,
    });

    res.status(200).json({ status: "success", data: { item } });
  } catch (error) {
    if (error.code === "P2025") {
      const prismaError = new Error("Item not found");
      prismaError.status = 404;
      prismaError.code = "VISIT_ITEM_NOT_FOUND";
      throw prismaError;
    }
    throw error;
  }
};

const deleteManyVisitItems = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body;
  const userId = req.user.id;

  const visit = await prisma.visit.findFirst({ where: { id, userId } });
  if (!visit) {
    const error = new Error("Visit not found");
    error.status = 404;
    error.code = "VISIT_NOT_FOUND";
    throw error;
  }

  const deleted = await prisma.visitItem.deleteMany({
    where: {
      id: { in: ids },
      visitId: id,
    },
  });

  res.status(200).json({
    status: "success",
    message: `${deleted.count} items removed from visit.`,
    requestedCount: ids.length,
    deletedCount: deleted.count,
  });
};

export {
  createVisit,
  getVisits,
  getVisit,
  updateVisit,
  deleteVisit,
  addVisitItem,
  updateVisitItem,
  deleteManyVisitItems,
};
