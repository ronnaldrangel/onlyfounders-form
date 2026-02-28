"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, Check } from "lucide-react";

const formSchema = z.object({
  nome: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefone: z.string().min(10, "Teléfono inválido"),
  email: z.string().email("Correo electrónico inválido"),
  genero: z.enum(["masculino", "feminino", "outro"]).optional().refine((val) => val !== undefined, {
    message: "Selecciona un género",
  }),
});

export type FormData = z.infer<typeof formSchema>;

export const steps = [
  {
    id: 1,
    title: "¿Cuál es tu nombre?",
    subtitle: "Empecemos con una presentación simple",
    field: "nome" as const,
    placeholder: "Escribe tu nombre completo",
    type: "text",
  },
  {
    id: 2,
    title: "¿Cuál es tu teléfono?",
    subtitle: "Lo necesitamos para contactarte",
    field: "telefone" as const,
    placeholder: "(00) 00000-0000",
    type: "tel",
  },
  {
    id: 3,
    title: "¿Cuál es tu correo electrónico?",
    subtitle: "Te enviaremos información importante",
    field: "email" as const,
    placeholder: "tu@correo.com",
    type: "email",
  },
  {
    id: 4,
    title: "¿Cuál es tu género?",
    subtitle: "Selecciona la opción que mejor te representa",
    field: "genero" as const,
    type: "select",
  },
];

const generoOptions = [
  { value: "masculino", label: "Masculino", emoji: "👨" },
  { value: "feminino", label: "Femenino", emoji: "👩" },
  { value: "outro", label: "Otro / Prefiero no decir", emoji: "🧑" },
];

interface InleadFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
}

export default function InleadForm({ 
  currentStep, 
  setCurrentStep, 
  isCompleted, 
  setIsCompleted 
}: InleadFormProps) {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      genero: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
  } = methods;

  const currentField = steps[currentStep].field;
  const currentValue = watch(currentField);
  const hasError = errors[currentField];

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleNext = async () => {
    const isStepValid = await trigger(currentField);
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado:", data);
    setIsCompleted(true);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Felicidades!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Tu registro se ha completado exitosamente. ¡Pronto nos pondremos en contacto contigo!
          </p>
          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentStep(0);
              reset();
            }}
            className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
          >
            Enviar nuevo formulario
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Form content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="p-8 pt-0">
            {/* Title and subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-500">
                {steps[currentStep].subtitle}
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep].type === "select" ? (
                    <div className="space-y-3">
                      {generoOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => setValue("genero", option.value as any, { shouldValidate: true })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 ${
                            currentValue === option.value
                              ? "border-black bg-gray-100"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <span className="text-3xl">{option.emoji}</span>
                          <span className={`font-medium ${
                            currentValue === option.value ? "text-black" : "text-gray-700"
                          }`}>
                            {option.label}
                          </span>
                          {currentValue === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        {...register(currentField, {
                          onChange: (e) => {
                            if (steps[currentStep].field === "telefone") {
                              e.target.value = formatPhone(e.target.value);
                            }
                          },
                        })}
                        type={steps[currentStep].type}
                        placeholder={steps[currentStep].placeholder}
                        className={`w-full px-5 py-4 text-lg bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                          hasError
                            ? "border-red-400 focus:border-red-500 bg-red-50/50"
                            : "border-gray-200 focus:border-black focus:bg-white"
                        }`}
                        autoFocus
                      />
                    </div>
                  )}

                  {hasError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-red-500 text-sm flex items-center gap-1"
                    >
                      {hasError.message}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="mt-8">
                {currentStep === steps.length - 1 ? (
                  <motion.button
                    type="submit"
                    disabled={!currentValue}
                    whileHover={currentValue ? { scale: 1.02 } : {}}
                    whileTap={currentValue ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      currentValue
                        ? "bg-black hover:bg-gray-800"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span>Finalizar Registro</span>
                    <Check className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={!currentValue || !!hasError}
                    whileHover={currentValue && !hasError ? { scale: 1.02 } : {}}
                    whileTap={currentValue && !hasError ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      currentValue && !hasError
                        ? "bg-black hover:bg-gray-800"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span>Continuar</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          El formulario tarda aproximadamente 1 minuto en completarse
        </motion.p>
      </div>
    </FormProvider>
  );
}
