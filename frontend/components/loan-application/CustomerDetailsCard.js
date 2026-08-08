import { Calendar, Hash, Mail, MapPin, Phone, User, UserCircle2 } from "lucide-react";
import TextField from "@/components/forms/TextField";

export default function CustomerDetailsCard({ register, errors, disabled }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
          <UserCircle2 className="w-4.5 h-4.5 text-[var(--color-primary)]" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-semibold text-[var(--color-heading)]">Customer Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Full Name"
          icon={User}
          placeholder="e.g. Rahul Sharma"
          disabled={disabled}
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <TextField
          label="Mobile Number"
          icon={Phone}
          placeholder="10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          disabled={disabled}
          error={errors.mobile_number?.message}
          {...register("mobile_number")}
        />
        <TextField
          label="Email ID"
          icon={Mail}
          type="email"
          placeholder="name@example.com"
          disabled={disabled}
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Date of Birth"
          icon={Calendar}
          type="date"
          disabled={disabled}
          error={errors.date_of_birth?.message}
          {...register("date_of_birth")}
        />
        <TextField
          label="City"
          icon={MapPin}
          placeholder="e.g. Pune"
          disabled={disabled}
          error={errors.city?.message}
          {...register("city")}
        />
        <TextField
          label="Pincode"
          icon={Hash}
          placeholder="6-digit pincode"
          inputMode="numeric"
          maxLength={6}
          disabled={disabled}
          error={errors.pincode?.message}
          {...register("pincode")}
        />
      </div>
    </div>
  );
}
