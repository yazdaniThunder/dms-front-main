import {environment} from '../../../environments/environment';

export class AppSettings {
  public static CUSTOMIZE_API_ENDPOINT = environment.customizeServiceUrl;
  public static DOCUMENTS_ENDPOINT = environment.documentBaseUrl;
}
