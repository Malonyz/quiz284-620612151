import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from 'uuid';

const router = Router();


// GET /api/vXXX/items/:userId 
router.get("",(req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const userItems = items.filter((item: Item) => item.userId === userId);
  try {
    return res.status(200).json({
      success: true,
      data: userItems,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "items for user Id: " + userId+"not found",
    });

  } 
  
  });

// POST /api/vXXX/items/:userId, body = {new item data}
// add a new Item for userId
router.post("/",async (req: Request, res: Response) => {
  const UUiD = uuidv4();
  const newItem: Item = {
    userId: req.body.userId,
    itemId: UUiD,
    product_name: req.body.product_name,
    unit_price: req.body.unit_price,
    quantity: req.body.quantity,
    category: req.body.category
  };
  items.push(newItem) ;
  return res.status(201).json({
    success: true,
    message: "New Item has been added successfully",
    data: newItem,
  });
  
});

// Delete /api/vXXX/items/:userId
 router.delete("/:userId/:itemId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId; 
  if (!userId ){
    return res.status(400).json({
      success: false,
      message: "Fobbiden access",
    });
  }
  try {
    const index = items.findIndex((item: Item) => item.itemId === itemId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "There are no items with itemId: " + itemId ,
      });
    }
    items.splice(index, 1);
    return res.status(200).json({
      success: true,
      message: "Item Id: " + itemId + " has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;