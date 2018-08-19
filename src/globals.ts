import Vue from 'vue';
import 'globals';

export class Globals {
  public ROLE_TRANSLATIONS: Map<string, string> = new Map<string, string>([
    ['Participant', 'Участник'],
    ['Organizer', 'Организатор']
  ]);

  public SYSTEM_NAME: string = 'ITLab';

  public DATETIME_FORMAT: string = 'DD.MM.YYYY HH:mm';
  public DATE_FORMAT: string = 'DD.MM.YYYY';
  public TIME_FORMAT: string = 'HH:mm';
}

const globals: Globals = new Globals();
export default globals;
