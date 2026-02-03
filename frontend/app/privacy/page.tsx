import BackButton from "../components/navbar/backButton"

function page() {
    return (
        <div className="p-4 flex flex-col gap-4 mb-18 mt-12">
            <BackButton></BackButton>
            <div className="flex flex-col items-center justify-center">
            <h1 className="text-center font-bold text-2xl">Política de Privacidad</h1>
            <p className="text-zinc-500 text-sm">Última actualización: Febrero de 2026</p>
            </div>


            <p>
                La presente Política de Privacidad describe cómo se recopila, utiliza y protege
                la información personal de los usuarios de la aplicación <strong>Audio Bahía Blanca </strong>
                (en adelante, “la aplicación”).
            </p>

            <h2 className="font-semibold border-b border-zinc-600">1. Información que recopilamos</h2>
            <p>
                La aplicación utiliza inicio de sesión mediante Google únicamente para fines
                de autenticación. En ese proceso se recopilan los siguientes datos:
            </p>
            <ul className="ml-8">
                <li>- Nombre</li>
                <li>- Dirección de correo electrónico</li>
            </ul>
            <p>No se recopila ningún otro dato personal.</p>

            <h2 className="font-semibold border-b border-zinc-600">2. Uso de la información</h2>
            <p>La información recopilada se utiliza exclusivamente para:</p>
            <ul className="ml-8">
                <li>- Identificar al usuario dentro de la aplicación</li>
                <li>- Permitir el acceso seguro a las funcionalidades de la aplicación</li>
            </ul>
            <p>
                Los datos no se utilizan con fines comerciales, publicitarios ni de marketing.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">3. Uso privado de la aplicación</h2>
            <p>
                La app está diseñada para ser utilizada de forma privada dentro del
                circuito. La aplicación no está destinada al uso
                público general, salvo que esta condición sea modificada en el futuro, en cuyo
                caso esta política será actualizada.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">4. Compartición de la información</h2>
            <p>
                La información personal no se comparte con terceros, salvo en los casos
                estrictamente necesarios para el funcionamiento del inicio de sesión mediante
                Google, conforme a las políticas de Google OAuth.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">5. Almacenamiento y seguridad</h2>
            <p>
                Los datos se almacenan de forma segura y se aplican medidas razonables para
                protegerlos contra accesos no autorizados, pérdida o uso indebido.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">6. Derechos del usuario</h2>
            <p>El usuario puede solicitar:</p>
            <ul className="ml-8">
                <li>- Acceso a sus datos personales</li>
                <li>- La eliminación de su cuenta y de los datos asociados</li>
            </ul>
            <p>
                Para ejercer estos derechos, puede comunicarse a través del contacto indicado
                más abajo.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">7. Cambios en esta política</h2>
            <p>
                Esta Política de Privacidad puede ser actualizada si la aplicación cambia su
                alcance, funcionalidades o modalidad de uso. Cualquier modificación será
                publicada en esta misma página.
            </p>

            <h2 className="font-semibold border-b border-zinc-600">8. Contacto</h2>
            <p>
                Si tenés preguntas sobre esta Política de Privacidad o sobre el uso de tus datos,
                podés comunicarte a:
            </p>
            <p><strong>Correo electrónico:</strong> urrutiarami@gmail.com</p>
        </div>
    )
}

export default page