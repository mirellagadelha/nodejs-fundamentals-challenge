import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import ImportTransactionService from '../services/ImportTransactionService';

const transactionRouter = Router();
const upload = multer(uploadConfig);

transactionRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const importTransaction = new ImportTransactionService();

      const transaction = await importTransaction.execute(request.file.path);

      return response.json(transaction);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default transactionRouter;
