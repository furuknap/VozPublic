
import { Translations } from '@/types/translations';

export const spanishTranslations: Translations = {
  common: {
    appName: 'Voz Centro de Comentarios',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    submit: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    loading: 'Cargando...',
    getStarted: 'Empieza Gratis',
    learnMore: 'Aprende Más',
    features: '¿Cómo Funciona?',
    whyChoose: '¿Por Qué Elegir Voz?',
    startCollecting: 'Comienza a Recopilar Opiniones Hoy'
  },
  auth: {
    loginTitle: 'Bienvenido de nuevo',
    registerTitle: 'Crear Cuenta',
    loginButton: 'Iniciar Sesión',
    registerButton: 'Registrarse',
    forgotPassword: '¿Olvidó su contraseña?',
    authError: 'Error de autenticación',
    emailRequired: 'El correo electrónico es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
    continueWithGoogle: 'Continuar con Google',
    signInDescription: 'Inicia sesión con tu cuenta de Google para continuar'
  },
  dashboard: {
    title: 'Tus Encuestas',
    createSurvey: 'Crear Nueva Encuesta',
    noSurveys: 'No se encontraron encuestas. ¡Crea tu primera encuesta!',
    surveyResults: 'Ver Resultados',
    shareSurvey: 'Compartir',
    responsesCount: 'Respuestas',
    noSurveysDescription: "Aún no has creado ninguna encuesta. Crea tu primera encuesta para comenzar.",
    createdAt: 'Creada el',
    noDescription: 'Sin descripción.'
  },
  survey: {
    create: 'Crear Encuesta',
    title: 'Título de la Encuesta',
    description: 'Descripción',
    addQuestion: 'Agregar Pregunta',
    questionType: 'Tipo de Pregunta',
    questionText: 'Texto de la Pregunta',
    options: 'Opciones',
    addOption: 'Agregar Opción',
    required: 'Obligatorio',
    preview: 'Vista Previa',
    save: 'Guardar Encuesta',
    questionTypes: {
      yesNo: 'Sí/No',
      multipleChoice: 'Opción Múltiple',
      rating: 'Calificación (1-5)',
    },
    surveyDetails: 'Detalles de la Encuesta',
    enterTitle: 'Ingresa el título de la encuesta',
    enterDescription: 'Ingresa la descripción de la encuesta (opcional)',
    questionNumber: 'Pregunta',
    enterQuestionText: 'Ingresa el texto de la pregunta',
    option: 'Opción',
    saving: 'Guardando...'
  },
  response: {
    thankYou: '¡Gracias por tus comentarios!',
    submit: 'Enviar Comentarios',
    required: 'Este campo es obligatorio',
    yes: 'Sí',
    no: 'No',
    ratingLabel: 'Calificación',
  },
  report: {
    title: 'Resultados de la Encuesta',
    exportPNG: 'Exportar Gráficos como PNG',
    exportCSV: 'Exportar Datos como CSV',
    responsesCount: 'Total de Respuestas',
    averageRating: 'Calificación Promedio',
    noData: 'Aún no hay respuestas',
  },
  features: {
    title: 'Creación Fácil de Encuestas',
    shareTitle: 'Comparte con Cualquiera',
    analyticsTitle: 'Análisis Detallado',
    description: 'Crea encuestas profesionales con múltiples tipos de preguntas en minutos.',
    shareDescription: 'Genera enlaces únicos y códigos QR para compartir tus encuestas con tu audiencia.',
    analyticsDescription: 'Obtén resultados en tiempo real y analiza las respuestas con gráficos e informes.'
  },
  benefits: {
    unlimited: 'Crea encuestas ilimitadas con nuestra interfaz fácil de usar',
    questionTypes: 'Elige entre múltiples tipos de preguntas incluyendo Sí/No, Opción Múltiple y Escalas de Valoración',
    sharing: 'Comparte encuestas a través de enlaces personalizados y códigos QR',
    realTime: 'Obtén respuestas y análisis en tiempo real',
    export: 'Exporta tus datos en múltiples formatos',
    multilingual: 'Soporte multilingüe con interfaces en inglés y español'
  }
};

