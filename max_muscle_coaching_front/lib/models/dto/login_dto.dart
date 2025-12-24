class LoginDTO {
  final String? token;
  final String? refreshToken;
  final String? message;

  LoginDTO({
    required this.token,
    required this.message,
    required this.refreshToken,
  });

  factory LoginDTO.fromJson(Map<String, dynamic> json) => LoginDTO(token: json['token'], message: json['message'], refreshToken: json['refreshToken']);
}
