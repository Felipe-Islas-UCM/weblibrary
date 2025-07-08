const About = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-amber-800 mb-8">
            Sobre el Proyecto
          </h1>
          
          <div className="space-y-6">
            <p className="text-gray-700 text-lg text-center mb-8">
              Sistema de Gestión de Biblioteca desarrollado para la Universidad Católica del Maule
            </p>
  
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-amber-700 mb-6 text-center">
                Autores
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                  <h3 className="text-xl font-medium text-amber-900">Felipe Islas</h3>
                  <a 
                    href="mailto:felipe.islas@alu.ucm.cl" 
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    felipe.islas@alu.ucm.cl
                  </a>
                </div>
  
                <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                  <h3 className="text-xl font-medium text-amber-900">Juaquin Rojas</h3>
                  <a 
                    href="mailto:juaquin.rojas@alu.ucm.cl" 
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    juaquin.rojas@alu.ucm.cl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;