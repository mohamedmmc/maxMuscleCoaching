part of '../onboarding_screen.dart';

class _Step1 extends StatelessWidget {
  const _Step1({
    required this.nameController,
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.ageController,
    required this.weightController,
    required this.heightController,
    required this.gender,
    required this.onChangeGender,
    required this.obscurePassword,
    required this.obscureConfirmPassword,
    required this.onTogglePasswordVisibility,
    required this.onToggleConfirmPasswordVisibility,
    required this.nameError,
    required this.emailError,
    required this.passwordError,
    required this.confirmPasswordError,
    required this.ageError,
    required this.weightError,
    required this.heightError,
    super.key,
  });

  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final TextEditingController ageController;
  final TextEditingController weightController;
  final TextEditingController heightController;
  final Gender gender;
  final ValueChanged<Gender> onChangeGender;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final VoidCallback onTogglePasswordVisibility;
  final VoidCallback onToggleConfirmPasswordVisibility;
  final bool nameError;
  final bool emailError;
  final bool passwordError;
  final bool confirmPasswordError;
  final bool ageError;
  final bool weightError;
  final bool heightError;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _Field(
            label: 'Full Name',
            controller: nameController,
            keyboardType: TextInputType.name,
            error: nameError,
          ),
          const SizedBox(height: 14),
          _Field(
            label: 'Email',
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            error: emailError,
          ),
          const SizedBox(height: 14),
          _PasswordField(
            label: 'Password',
            controller: passwordController,
            obscureText: obscurePassword,
            error: passwordError,
            onToggleVisibility: onTogglePasswordVisibility,
          ),
          const SizedBox(height: 14),
          _PasswordField(
            label: 'Confirm Password',
            controller: confirmPasswordController,
            obscureText: obscureConfirmPassword,
            error: confirmPasswordError,
            onToggleVisibility: onToggleConfirmPasswordVisibility,
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _Field(
                  label: 'Age',
                  controller: ageController,
                  keyboardType: TextInputType.number,
                  error: ageError,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _Field(
                  label: 'Kg',
                  controller: weightController,
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  error: weightError,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _Field(
                  label: 'Cm',
                  controller: heightController,
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  error: heightError,
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          _Segmented(
            label: 'Gender',
            items: Gender.values,
            selected: gender,
            title: (g) => g.label,
            onChanged: onChangeGender,
          ),
        ],
      ),
    );
  }
}

class _PasswordField extends StatelessWidget {
  const _PasswordField({
    required this.label,
    required this.controller,
    required this.obscureText,
    required this.error,
    required this.onToggleVisibility,
  });

  final String label;
  final TextEditingController controller;
  final bool obscureText;
  final bool error;
  final VoidCallback onToggleVisibility;

  @override
  Widget build(BuildContext context) {
	    final border = OutlineInputBorder(
	      borderRadius: BorderRadius.circular(18),
	      borderSide: BorderSide(color: error ? AppColors.red400 : AppColors.transparent, width: 2),
	    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 6),
	          child: Text(
	            label.toUpperCase(),
	            style: AppTextStyles.caps(
	              size: 10,
	              weight: FontWeight.w800,
	              letterSpacing: 2,
	              color: AppColors.grey600,
	            ),
	          ),
	        ),
        TextField(
	          controller: controller,
	          obscureText: obscureText,
	          style: AppTextStyles.label(size: 14, weight: FontWeight.w800, color: AppColors.white),
	          decoration: InputDecoration(
	            filled: true,
	            fillColor: AppColors.surfaceHighlight,
	            suffixIcon: IconButton(
	              icon: Icon(
	                obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
	                color: AppColors.grey600,
	              ),
	              onPressed: onToggleVisibility,
	            ),
            border: border,
	            enabledBorder: border,
	            focusedBorder: border.copyWith(
	              borderSide: BorderSide(color: error ? AppColors.red400 : AppColors.volt, width: 2),
	            ),
	            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
	          ),
        ),
      ],
    );
  }
}

class _Segmented<T> extends StatelessWidget {
  const _Segmented({
    required this.label,
    required this.items,
    required this.selected,
    required this.title,
    required this.onChanged,
  });

  final String label;
  final List<T> items;
  final T selected;
  final String Function(T) title;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 10),
	          child: Text(
	            label.toUpperCase(),
	            style: AppTextStyles.caps(
	              size: 10,
	              weight: FontWeight.w800,
	              letterSpacing: 2,
	              color: AppColors.grey600,
	            ),
	          ),
	        ),
        DecoratedBox(
          decoration: BoxDecoration(
            color: AppColors.surfaceHighlight,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: Row(
              children: [
                for (final item in items) ...[
                  Expanded(
                    child: InkWell(
                      onTap: () => onChanged(item),
                      borderRadius: BorderRadius.circular(12),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 12),
	                        decoration: BoxDecoration(
	                          color: item == selected
	                              ? AppColors.volt
	                              : AppColors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            if (item == selected)
                              BoxShadow(
                                color: AppColors.volt.withValues(alpha: 0.15),
                                blurRadius: 20,
                                spreadRadius: 1,
                              ),
                          ],
                        ),
                        child: Center(
	                          child: Text(
	                            title(item),
	                            style: AppTextStyles.label(
	                              size: 12,
	                              weight: FontWeight.w900,
	                              letterSpacing: 0.2,
	                              color: item == selected ? AppColors.black : AppColors.grey500,
	                            ),
	                          ),
                        ),
                      ),
                    ),
                  ),
                  if (item != items.last) const SizedBox(width: 4),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}
