import 'dart:async';

import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:max_muscle_coaching_front/helper/helper.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';

import 'secure_token_storage.dart';
import 'shared_preferences.dart';

enum ForgotPasswordStep { sendEmail, changePassword }

enum LoginWidgetState {
  login,
  signup,
  forgotPassword;

  bool get isSignUp => this == LoginWidgetState.signup;
  bool get isLogin => this == LoginWidgetState.login;
  bool get isChangePassword => this == LoginWidgetState.forgotPassword;
}

class AuthenticationService extends GetxController {
  static AuthenticationService get find => Get.find<AuthenticationService>();
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<FormState> notificationFormKey = GlobalKey();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  final TextEditingController bodyNotifcationController = TextEditingController();
  final TextEditingController textNotifcationController = TextEditingController();
  final TextEditingController nameDestinationController = TextEditingController();
  final TextEditingController description1DestinationController = TextEditingController();
  final TextEditingController description2DestinationController = TextEditingController();
  final TextEditingController description3DestinationController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController validationKeyController = TextEditingController();
  ForgotPasswordStep _screenState = ForgotPasswordStep.sendEmail;
  LoginWidgetState _currentState = LoginWidgetState.login;
  bool _isPhoneInput = true;
  bool _sendingEmail = false;
  bool stayLoggedIn = false;
  bool _firstMailSent = false;

  bool _isLoggingIn = false;
  bool isReady = false;
  String? phoneNumber;
  RxInt notSeenMessages = 0.obs;
  String? idUser;

  // Available logged in user data from JWT token
  bool? isUserVerified;
  User? _jwtClientData;

  bool get isPhoneInput => _isPhoneInput;

  bool get isUserLoggedIn => isReady ? _jwtClientData != null : false;

  User? get jwtClientData {
    String? savedToken = SecureTokenStorage.find.jwt;
    if (isUserLoggedIn && _jwtClientData == null && savedToken != null) {
      _jwtClientData = User.fromToken(JWT.decode(savedToken).payload);
    }
    return isUserLoggedIn ? _jwtClientData : null;
  }

  LoginWidgetState get currentState => _currentState;

  bool get isLoggingIn => _isLoggingIn;

  bool get sendingEmail => _sendingEmail;

  bool get firstMailSent => _firstMailSent;

  ForgotPasswordStep get screenState => _screenState;

  set screenState(ForgotPasswordStep value) {
    _screenState = value;
    update();
  }

  set firstMailSent(bool value) {
    _firstMailSent = value;
    if (_firstMailSent) _sendingEmail = false;
    update();
  }

  set sendingEmail(bool value) {
    _sendingEmail = value;
    update();
  }

  set isLoggingIn(bool value) {
    _isLoggingIn = value;
    update();
  }

  set currentState(LoginWidgetState value) {
    _currentState = value;
    update();
  }

  set isPhoneInput(bool value) {
    _isPhoneInput = value;
    update();
  }

  AuthenticationService() {
    Helper.waitAndExecute(() => SharedPreferencesService.find.isReady, () async {
      final savedToken = SecureTokenStorage.find.jwt;
      // await UserRepository.find.checkFCM(userID: savedToken != null ? JWT.decode(savedToken).payload['id'] : null);
      if (savedToken != null) {
        final jwtPayload = JWT.decode(savedToken).payload;
        final isTokenExpired = JwtDecoder.isExpired(savedToken);
        isUserVerified = jwtPayload['isVerified'];

        if ((isUserVerified ?? false) && !isTokenExpired) {
          _jwtClientData = User.fromToken(jwtPayload);
          // init chat messages standBy room
          WidgetsBinding.instance.addPostFrameCallback((timeStamp) => update());
        }
        if (isTokenExpired) {
          await renewToken();
        }
      }
      // else if (_auth.currentUser != null) {
      //   _silentGoogleLogin();
      // } else {
      //   // _checkIfFacebookUserIsLogged();
      // }
      // getNotSeenMessages();
      isReady = true;
    });
  }

  void updateToken({required String token}) {
    final jwtPayload = JWT.decode(token).payload;
    _jwtClientData = User.fromToken(jwtPayload);
  }

  Future<void> renewToken() async {
    final savedRefreshToken = SecureTokenStorage.find.refreshToken;
    if (savedRefreshToken != null) {
      final Map<String, dynamic> refreshToken = {refreshTokenKey: savedRefreshToken};
      final loginDTO = await UserRepository.find.renewJWT(token: refreshToken);
      if (loginDTO?.refreshToken != null) {
        await SecureTokenStorage.find.setRefreshToken(loginDTO!.refreshToken!);
        try {
          final jwtPayload = JWT.decode(loginDTO.token ?? '').payload;
          _jwtClientData = User.fromToken(jwtPayload);
        } catch (e) {
          Get.snackbar('oups'.tr, 'session_expired'.tr);
        }
        initiateCurrentUser(loginDTO.token);
      }
    } else {
      await SecureTokenStorage.find.clear();
    }
  }

  Future<User?> fetchUserData() async {
    return await Helper.waitAndExecute(
      () => SharedPreferencesService.find.isReady && AuthenticationService.find.jwtClientData?.id != null,
      () async {
        final loggedInClient = await UserRepository.find.getLoggedInUser();
        if (loggedInClient?.id != null) {
          isUserVerified = await UserRepository.find.checkVerifiedUser();
        }
        return loggedInClient;
      },
    );
  }

  // Future<Map<String, String?>?> signInWithGoogle({bool isLinking = false, bool isSignUp = false}) async {
  //   try {
  //     GoogleAuthProvider googleProvider = GoogleAuthProvider();
  //     UserCredential? result;
  //     if (kIsWeb) {
  //       googleProvider.setCustomParameters({
  //         'prompt': 'select_account',
  //       });

  //       result = await FirebaseAuth.instance.signInWithPopup(googleProvider);
  //     } else {
  //       final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
  //       final GoogleSignInAuthentication? googleAuth = await googleUser?.authentication;
  //       final credential = GoogleAuthProvider.credential(
  //         accessToken: googleAuth?.accessToken,
  //         idToken: googleAuth?.idToken,
  //       );
  //       result = await FirebaseAuth.instance.signInWithCredential(credential);
  //     }
  //     if (result.user != null) {
  //       return _silentGoogleLogin(isLinking: isLinking, isSignUp: isSignUp);
  //     } else {
  //       LoggerService.logger?.e('Sign-in failed due to unknown reason.'); // Handle failed sign-in
  //     }
  //   } on firebase.FirebaseAuthException catch (e) {
  //     LoggerService.logger?.e('Firebase error: $e'); // Handle Firebase-specific errors
  //   } catch (error) {
  //     LoggerService.logger?.e('Error: $error'); // Handle general errors
  //   }
  //   return null;
  // }

  // Future<Map<String, String?>?> facebookLogin({bool isLinking = false, bool isSignUp = false}) async {
  //   try {
  //     final LoginResult result = await FacebookAuth.instance.login();
  //     if (result.status == LoginStatus.success) {
  //       return await _silentFacebookLogin(isLinking: isLinking, isSignUp: isSignUp);
  //     } else {
  //       LoggerService.logger?.e('Error occured with Facebook login status: ${result.status}\nError message: ${result.message}');
  //       return null;
  //     }
  //   } catch (e) {
  //     LoggerService.logger?.e('Error: $e');
  //   }
  //   return null;
  // }

  // static Future<void> refreshScreen() async {
  //   if (GoRouter.of(NavHelper.navigatorKeyGo.currentContext!).state.matchedLocation == ProfileScreen.routeName) {
  //     // Helper.manageNavigation(HomeScreen.routeName);
  //     // } else if (GoRouter.of(context).state.matchedLocation == HomeScreen.routeName || GoRouter.of(context).state.matchedLocation == PropertiesScreen.routeName) {
  //   } else if (GoRouter.of(NavHelper.navigatorKeyGo.currentContext!).state.matchedLocation == PropertiesScreen.routeName) {
  //     PropertiesController.find.page = 0;
  //     await PropertiesController.find.getProperties();
  //     PropertiesController.find.update();
  //   }
  // }

  Future<void> logout({bool reset = false}) async {
    // bool isFacebookLoggedIn = false;
    // try {
    //   isFacebookLoggedIn = (await FacebookAuth.instance.accessToken) != null;
    // } catch (e) {
    //   LoggerService.logger?.e('Error: $e');
    // }
    // if (_auth.currentUser != null) await _googleLogout();
    // if (isFacebookLoggedIn) await _facebookLogout();
    await SecureTokenStorage.find.clear();

    _jwtClientData = null;

    // refreshScreen();
    update();
  }

  Future<void> classicLogin() async {
    if (formKey.currentState?.validate() ?? false) {
      isLoggingIn = true;
      final user = User(
        email: emailController.text.isEmpty ? null : emailController.text,
        password: passwordController.text,
        // phone: Helper.isNullOrEmpty(phoneNumber) ? null : phoneNumber,
      );
      await _handleLogin(user);
    }
  }

  Future<void> signUpClient({User? user, String? routeName}) async {
    if (user == null && (formKey.currentState?.validate() ?? false) || user != null) {
      isLoggingIn = true;
      user ??= User(
        name: nameController.text.isEmpty ? null : nameController.text,
        lastName: lastNameController.text.isEmpty ? null : lastNameController.text,
        email: emailController.text.isEmpty ? null : emailController.text,
        password: passwordController.text,
      );
      final jwt = await UserRepository.find.signup(user: user, iduser: idUser);
      isLoggingIn = false;
      if (jwt != null) {
        if (idUser == null) {
          Get.back();
        }
      }
    }
  }

  void clearFormFields() {
    nameController.text = '';
    lastNameController.text = '';
    emailController.text = '';
    phoneController.text = '';
    passwordController.text = '';
    confirmPasswordController.text = '';
    phoneNumber = null;
    _currentState = LoginWidgetState.login;
    _isLoggingIn = false;
    _isPhoneInput = true;
    resetForgotPassword();
  }

  void resetForgotPassword() {
    emailController.text = '';
    passwordController.text = '';
    confirmPasswordController.text = '';
    validationKeyController.text = '';
    _currentState = LoginWidgetState.login;
    _screenState = ForgotPasswordStep.sendEmail;
    _firstMailSent = false;
    _sendingEmail = false;
  }

  // Future<void> _facebookLogout() async => await FacebookAuth.instance.logOut();

  // Future<void> _googleLogout() async {
  //   await _auth.signOut();
  //   await _googleSignIn.signOut();
  // }

  // Future<void> _checkIfFacebookUserIsLogged() async {
  //   final accessToken = await FacebookAuth.instance.accessToken;
  //   if (accessToken != null) _silentFacebookLogin();
  // }

  // Map<String, String?>? _silentGoogleLogin({bool isLinking = false, bool isSignUp = false}) {
  //   final googleUser = User(
  //     email: _auth.currentUser!.email,
  //     name: _auth.currentUser!.displayName,
  //     picture: _auth.currentUser!.photoURL,
  //     googleId: _auth.currentUser!.providerData[0].uid,
  //   );
  //   if (isSignUp) {
  //     signUpClient(user: googleUser);
  //   } else {
  //     if (!isLinking) _handleLogin(googleUser);
  //   }
  //   return {'googleId': googleUser.googleId, 'email': googleUser.email, 'name': googleUser.name, 'picture': googleUser.picture};
  // }

  // Future<Map<String, String?>?> _silentFacebookLogin({bool isLinking = false, bool isSignUp = false}) async {
  //   final userData = await FacebookAuth.instance.getUserData();
  //   final facebookUser = User(
  //     email: userData['email'],
  //     name: userData['name'],
  //     picture: userData['picture']['data']['url'],
  //     facebookId: userData['id'],
  //   );
  //   if (isSignUp) {
  //     signUpClient(user: facebookUser);
  //   } else {
  //     if (!isLinking) _handleLogin(facebookUser);
  //   }
  //   return {'facebookId': facebookUser.facebookId, 'email': facebookUser.email, 'name': facebookUser.name};
  // }

  Future<void> _handleLogin(User user) async {
    final loginResponse = await UserRepository.find.login(user: user);
    isLoggingIn = false;
    if (loginResponse?.token != null) {
      if (loginResponse?.refreshToken != null) {
        await SecureTokenStorage.find.setRefreshToken(loginResponse!.refreshToken!);
      }
      initiateCurrentUser(loginResponse?.token, user: user, refresh: true);
    }
  }

  // Future<void> signInWithApple() async {
  //   AuthorizationCredentialAppleID credential = await SignInWithApple.getAppleIDCredential(
  //     scopes: [
  //       AppleIDAuthorizationScopes.email,
  //       AppleIDAuthorizationScopes.fullName,
  //     ],
  //   );
  //   final appleUser = User(
  //     email: credential.email,
  //     name: '${credential.givenName} ${credential.familyName}',
  //     appleId: credential.userIdentifier,
  //   );

  //   final signin = credential.email == null;
  //   if (signin) {
  //     _handleLogin(appleUser);
  //   } else {
  //     signUpClient(user: appleUser);
  //   }
  // }

  void initiateCurrentUser(String? jwt, {User? user, bool refresh = false}) {
    if (jwt != null) {
      final jwtPayload = JWT.decode(jwt).payload;
      final isTokenExpired = JwtDecoder.isExpired(jwt);
      isUserVerified = jwtPayload['isVerified'];
      // Only login verified users
      if ((isUserVerified ?? false) && !isTokenExpired) {
        SecureTokenStorage.find.setJwt(jwt);
        _jwtClientData ??= user ?? User.fromToken(jwtPayload);

        jwtClientData?.id = User.fromToken(jwtPayload).id;
        jwtClientData?.phoneNumber = User.fromToken(jwtPayload).phoneNumber;
        jwtClientData?.name = User.fromToken(jwtPayload).name;
        jwtClientData?.picture = User.fromToken(jwtPayload).picture;
        if (refresh) UserRepository.find.checkFCM();
        update();
      }

      update();
    }
  }

  Future<void> forgotPassword() async {
    if (formKey.currentState?.validate() ?? false) {
      await UserRepository.find.forgotPassword(passwordController.text, validationKeyController.text);
      resetForgotPassword();
    }
  }

  Future<void> sendVerificationKey() async {
    if (formKey.currentState?.validate() ?? false) {
      sendingEmail = true;
      final success = await UserRepository.find.sendChangePasswordCode(emailController.text);
      firstMailSent = true;
      if (success) screenState = ForgotPasswordStep.changePassword;
    }
  }

  Future<void> broadCastNotifcation(BuildContext context) async {
    if (notificationFormKey.currentState?.validate() ?? false) {
      final success = await UserRepository.find.broadcastNotification(body: bodyNotifcationController.text, title: textNotifcationController.text);
      if (success != null) {
        // ignore: use_build_context_synchronously
        Navigator.of(context).pop(false);
      }
    }
  }
}
