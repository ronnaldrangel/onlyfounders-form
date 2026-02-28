"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  nome: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefone: z.string().min(8, "Teléfono inválido"),
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
    placeholder: "+55 11 99999-9999",
    type: "phone",
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
    control,
  } = methods;

  const currentField = steps[currentStep].field;
  const currentValue = watch(currentField);
  const hasError = errors[currentField];



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
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¡Felicidades!
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Tu registro se ha completado exitosamente. ¡Pronto nos pondremos en contacto contigo!
            </p>
            <Button
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(0);
                reset();
              }}
              className="px-8"
            >
              Enviar nuevo formulario
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
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
          <div className="pt-0">
            {/* Title and subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground">
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
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-muted-foreground bg-card"
                          }`}
                        >
                          <span className="text-3xl">{option.emoji}</span>
                          <span className={`font-medium ${
                            currentValue === option.value ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {option.label}
                          </span>
                          {currentValue === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : steps[currentStep].type === "phone" ? (
                    <div className="relative w-full">
                      <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            placeholder={steps[currentStep].placeholder}
                            defaultCountry="BR"
                            className={cn(
                              "w-full",
                              hasError && "[&_input]:border-destructive [&_input]:focus-visible:ring-destructive"
                            )}
                            autoFocus
                          />
                        )}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        {...register(currentField)}
                        type={steps[currentStep].type}
                        placeholder={steps[currentStep].placeholder}
                        className={`w-full px-5 py-6 text-lg ${
                          hasError
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                        autoFocus
                      />
                    </div>
                  )}

                  {hasError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-destructive text-sm flex items-center gap-1"
                    >
                      {hasError.message}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="mt-8">
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={!currentValue}
                    className="w-full py-6 text-lg"
                    size="lg"
                  >
                    <span>Finalizar Registro</span>
                    <Check className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!currentValue || !!hasError}
                    className="w-full py-6 text-lg"
                    size="lg"
                  >
                    <span>Continuar</span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
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
          className="text-center text-muted-foreground text-sm mt-6"
        >
          El formulario tarda aproximadamente 1 minuto en completarse
        </motion.p>
      </div>
    </FormProvider>
  );
}
