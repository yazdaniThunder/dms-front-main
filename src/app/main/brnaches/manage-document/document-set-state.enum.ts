export enum DocumentSetStateEnum {
  REGISTERED = "ثبت شده",
  BRANCH_CONFIRMED = "تایید شده در شعبه",
  REJECTED = "عدم تایید",
  DELETED = "حذف شده",
  PRIMARY_CONFIRMED = "تایید شده اولیه",
  SCANNED = "اسکن شده",
  CONFLICTING = " دسته اسناد دارای مغایرت",
  SENT_CONFLICT = "دارای مغایرت ارسال شده",
  PROCESSED = "پردازش شده",
  FIX_CONFLICT = "رفع مغایرت دسته اسناد",
  COMPLETED = "اتمام یافته",
}

export enum DocumentStateEnum {
  NOT_CHECKED = "بررسی نشده",
  PRIMARY_CONFIRMED = "تایید شده اولیه",
  STAGNANT = "راکد",
  CONFLICTING = "فایل دارای مغایرت",
  SENT_CONFLICT = "دارای مغایرت ارسال شده",
  CONFLICTED_STAGNANT = "راکد دارای مغایرت",
  FIX_CONFLICT = "رفع مغایرت فایل",
  CONFIRM_FIX_CONFLICT = "تایید رفع مغایرت فایل",
}

export enum DocumentStateAllEnum {
  ALL = "همه",
  NOT_CHECKED = "بررسی نشده",
  PRIMARY_CONFIRMED = "تایید شده اولیه",
  STAGNANT = "راکد",
  CONFLICTING = "فایل دارای مغایرت",
  SENT_CONFLICT = "دارای مغایرت ارسال شده",
  CONFLICTED_STAGNANT = "راکد دارای مغایرت",
  FIX_CONFLICT = "رفع مغایرت فایل",
  CONFIRM_FIX_CONFLICT = "تایید رفع مغایرت فایل",
}

export enum RequestState {
  // ALL = "همه",
  REGISTERED = "ثبت شده",
  BRANCH_CONFIRMED = "تایید شده در شعبه",
  BRANCH_REJECTED = "عدم تایید در شعبه",
  DOCUMENT_OFFICE_CONFIRMED = "تایید شده در اداره اسناد",
  DOCUMENT_OFFICE_REJECTED = "عدم تایید در اداره اسناد",
  SENT_DOCUMENT_REQUESTED = "ارسال به شعبه درخواست دهنده",
  RECEIVE_DOCUMENT_REQUESTED = "دریافت در شعبه درخواست دهنده",
  EXPIRED_REQUEST = "درخواست منقضی شده",
  UPLOAD_FILE_OFFICE = "آپلود شده در اداره اسناد",
}

export enum RequestStateOffice {
  // ALL = "همه",
  REGISTERED = "ثبت شده",
  BRANCH_CONFIRMED = "تایید شده در شعبه",
  DOCUMENT_OFFICE_CONFIRMED = "تایید شده در اداره اسناد",
  DOCUMENT_OFFICE_REJECTED = "عدم تایید در اداره اسناد",
  SENT_DOCUMENT_REQUESTED = "ارسال به شعبه درخواست دهنده",
  RECEIVE_DOCUMENT_REQUESTED = "دریافت در شعبه درخواست دهنده",
  EXPIRED_REQUEST = "درخواست منقضی شده",
  UPLOAD_FILE_OFFICE = "آپلود شده در اداره اسناد",
}

export enum OtherDocumentState {
  REGISTERED = "ثبت شده",
  BRANCH_CONFIRMED = "تایید شده در شعبه",
  BRANCH_REJECTED = "عدم تایید در شعبه",
  SENT = "ارسال شده",
}
