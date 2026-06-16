part of '../dashboard_screen.dart';

class _LogBodyweightSheet extends StatefulWidget {
  const _LogBodyweightSheet({required this.onSubmit});

  final Future<bool> Function(double weight) onSubmit;

  @override
  State<_LogBodyweightSheet> createState() => _LogBodyweightSheetState();
}

class _LogBodyweightSheetState extends State<_LogBodyweightSheet> {
  final _controller = TextEditingController();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final raw = _controller.text.trim().replaceAll(',', '.');
    final value = double.tryParse(raw);
    if (value == null || value <= 0 || value > 600) {
      setState(() => _error = 'Enter a weight between 0 and 600 kg.');
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    final ok = await widget.onSubmit(value);
    if (!mounted) return;
    setState(() => _submitting = false);
    if (ok) {
      Navigator.of(context).pop();
    } else {
      setState(() => _error = 'Could not save. Try again.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Log bodyweight',
              style: AppTextStyles.title(size: 22, letterSpacing: -0.4),
            ),
            const SizedBox(height: 18),
            TextField(
              controller: _controller,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              autofocus: true,
              style: AppTextStyles.display(size: 28, letterSpacing: -0.8),
              decoration: InputDecoration(
                hintText: '72.5',
                suffixText: 'kg',
                filled: true,
                fillColor: AppColors.surfaceHighlight,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 8),
              Text(
                _error!,
                style: AppTextStyles.label(
                    size: 12, color: const Color(0xFFFF6868)),
              ),
            ],
            const SizedBox(height: 18),
            PrimaryButton(
              label: 'Save',
              isLoading: _submitting,
              onPressed: _submit,
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
