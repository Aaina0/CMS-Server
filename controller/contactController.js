import express from "express";
import { ContactModel } from "../models/Contact.js";

const createContact = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const newContact = new ContactModel({
      name,
      email,
      phone,
      address,
      postedBy: req.user._id,
    });

    const result = await newContact.save();
    return res.status(201).json({ success: true, ...result._id });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getContact = async (req, res) => {
  try {
    const contacts = await ContactModel.find({ postedBy: req.user._id });
    return res.status(200).json({ success: true, contacts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getContacts = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({ error: "No Id specified" });
  }
  try {
    const contacts = await ContactModel.findOne({ _id: id });
    return res.status(200).json({ success: true, ...contacts._doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateContacts = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );

    if (!updatedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, contact: updatedContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);
    if (!deletedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  createContact,
  getContact,
  getContacts,
  updateContacts,
  deleteContact,
};
