import {ID, Account, Client, Models, AppwriteException} from 'appwrite';
import Config from 'react-native-config';

import Snackbar from 'react-native-snackbar';

const appwriteClient = new Client();

const APPWRITE_ENDPOINT: string = Config.APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID: string = Config.APPWRITE_PROJECT_ID!;

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

class AppwriteService {
  private _account: Account;

  constructor() {
    appwriteClient
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);

    this._account = new Account(appwriteClient);
  }

  get account(): Account {
    return this._account;
  }

  // Create a new record of user inside appwrite
  async createAccount({
    email,
    password,
    name,
  }: CreateUserAccount): Promise<Models.User<Models.Preferences> | undefined> {
    try {
      const userAccount = await this._account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      // return userAccount;
      if (userAccount) {
        await this.loginAccount({email, password});
        return userAccount; // Return userAccount after successful login
      }
    } catch (error) {
      Snackbar.show({
        text: String(error),
        duration: Snackbar.LENGTH_LONG,
      });
      console.log('Appwrite service :: createAccount() :: ' + error);
    }
  }

  // Login the user using email and password with Appwrite
  async loginAccount({
    email,
    password,
  }: LoginUserAccount): Promise<Models.Session | undefined> {
    try {
      // Create a new session
      const newSession = await this._account.createEmailPasswordSession(
        email,
        password,
      );

      return newSession;
    } catch (error) {
      // Handle specific error scenarios
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401: // Unauthorized
            Snackbar.show({
              text: 'Invalid email or password',
              duration: Snackbar.LENGTH_LONG,
            });
            break;
          case 403: // Forbidden
            Snackbar.show({
              text: 'Access denied: insufficient permissions',
              duration: Snackbar.LENGTH_LONG,
            });
            break;
          default:
            Snackbar.show({
              text: String(error),
              duration: Snackbar.LENGTH_LONG,
            });
        }
      }
      console.log('Appwrite service :: loginAccount() :: ' + error);
      throw error; // Re-throw for further handling
    }
  }

  // Get the current logged user
  async getCurrentUser(): Promise<any> {
    try {
      const session = await this._account.getSession('current');
      if (session) {
        return await this._account.get();
      } else {
        Snackbar.show({
          text: 'No active session found, please login.',
          duration: Snackbar.LENGTH_LONG,
        });
        console.log(
          'Appwrite service :: getCurrentUser() :: No active session',
        );
      }
    } catch (error) {
      Snackbar.show({
        text: String(error),
        duration: Snackbar.LENGTH_LONG,
      });
      console.log('Appwrite service :: getCurrentUser() :: ' + error);
    }
  }

  // Logout the user
  async logoutAccount(): Promise<any> {
    try {
      return this._account.deleteSession('current');
    } catch (error) {
      Snackbar.show({
        text: String(error),
        duration: Snackbar.LENGTH_LONG,
      });
      console.log('Appwrite service :: logoutAccount() :: ' + error);
    }
  }
}

export default AppwriteService;
