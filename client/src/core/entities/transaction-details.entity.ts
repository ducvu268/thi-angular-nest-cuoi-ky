export enum TransType {
  DEPOSIT = 1,
  WITHDRAW = 2
}

export class TransactionDetails {
  _id: string;
  accID: string;
  transMoney: number;
  transType: TransType;
  dateOfTrans: Date;

  getFormattedAmount(): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(this.transMoney);
  }

  getTransactionTypeText(): string {
    return this.transType === TransType.DEPOSIT ? 'Tiền gửi' : 'Tiền rút';
  }

  getFormattedDate(): string {
    return this.dateOfTrans.toLocaleDateString('vi-VN');
  }
}