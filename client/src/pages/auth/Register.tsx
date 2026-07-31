import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition, PressableButton } from "@/components/PageTransition";
import { Shield, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "owner" as "owner" | "nominee",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit phone number";
    if (!form.password) e.password = "Password is required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength =
    form.password.length < 4 ? 0 : form.password.length < 8 ? 1 : 2;
  const strengthColors = ["bg-destructive", "bg-amber-500", "bg-accent"];
  const strengthWidths = ["w-1/3", "w-2/3", "w-full"];
  const strengthLabels = ["Weak", "Fair", "Strong"];

  return (
    <PageTransition>
      <div className="p-6 pt-12 flex flex-col items-center app-container min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
            <UserPlus size={32} className="text-secondary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-bold mb-1 text-foreground"
        >
          Create Account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-sm text-muted-foreground mb-8 text-center"
        >
          Start securing your family's future today.
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-md space-y-4"
        >
          {/* Role toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            {(["owner", "nominee"] as const).map((r) => (
              <button
                key={r}
                onClick={() => set("role", r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  form.role === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "owner" ? "🛡️ Owner" : "👤 Nominee"}
              </button>
            ))}
          </div>

          {/* Name */}
          <div>
            <input
              id="register-name"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <input
            id="register-email"
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Phone */}
          <div>
            <div className="flex">
              <span className="bg-muted border border-border rounded-l-lg px-3 py-3 text-sm text-muted-foreground">
                +91
              </span>
              <input
                id="register-phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="flex-1 bg-input border border-border border-l-0 rounded-r-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength]} ${strengthWidths[strength]}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <input
              id="register-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <PressableButton
            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </PressableButton>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
