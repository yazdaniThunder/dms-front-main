export class DocumentEnumUtil {
  public static getValue(mode:any) {
    return mode.value == 'ALL' ? null : mode.value;
  }
}
