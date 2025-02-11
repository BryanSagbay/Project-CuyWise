# Documentación del Proyecto CuyWise

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Servicio de Monitoreo](#Servicio-de-Monitoreo)
4. [API Exposición de IA](#backend-nodejs)
5. [Sistema de Detecion de Peso e Animal](#inteligencia-artificial-python)
6. [Configuración del Entorno](#configuración-del-entorno)
7. [Ejemplo de Uso](#ejemplo-de-uso)
8. [Autores](#autores)
9. [Licencia](#licencia)

---

## Descripción General
El proyecto **CuyWise** tiene como objetivo la detección, monitoreo y gestión de cuyes mediante modelos de IA y sensores, con una interfaz intuitiva en Angular y una API en Node.js.

---

## Estructura del Proyecto
#### Project-CuyWise:


#### Diagrama de la Base de Datos
<div align="center">

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcskyg-4YQyZn3gZ3dKmKT3zI_AkRv2wp0f5SKj_ssAuUifD-KgK5x1vG6bdEbIVsKlolv3n667SeYcZraqTRp_t0Hx1n3JU_2Mu-EVqhGIPAh8ojd8FqH92yDHcA7-QH96a1oRhQ?key=bJjD0ps2Yo0J-la2DckDGMcN)**
</div>

### SERVICIO DE MONITOREO ( Angular )

####  Instalación y Uso:
1. Instalar dependencias:
   ```bash
   cd monitoring-service
   npm install
   ```
  2. Ejecutar servidor
	 ```bash
	 ng serve
	  ``` 

### API EXPOSICIÓN DE IA ( Node.js )
#### Instalación y Uso
1. Instalar dependencias:
   ```bash
   cd api-exposed-service
   npm install
   ```
2. Configurar las variables de entorno en `.env`:
	```bash
   DB_HOST=*******
   DB_USER=*******
   DB_PASS=*******
   ```
3. Ejecutar el servidor:
	```bash
   npm start
   ```
### Endpoints

### SISTEMA DE DETECCIÓN DE PESO Y ANIMAL ( Python )
#### Instalación y Uso
1. Crear un entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Instalar dependencias:
	```bash
   `pip install -r requirements.txt`
   ```
  3. Ejectutar el sistema python:
		```bash
	     python3 index.py
	   ```
### Autores

Este proyecto fue realizado para fines investigativos bajo el nombre del Proyecto CuyWise.
COde:

```bash
	     import time
import RPi.GPIO as GPIO
from hx711 import HX711

# Configuración de pines
DT = 15   # GPIO12 (Pin 15)
SCK = 33  # GPIO13 (Pin 33)

# Inicializar HX711
hx = HX711(dout=DT, pd_sck=SCK)

# Leer datos sin procesar
while True:
    try:
        raw_value = hx.get_raw_data()
        if raw_value is not None:
            print(f"Lectura cruda: {raw_value}")
        else:
            print("Error en la lectura")
        time.sleep(0.5)

    except KeyboardInterrupt:
        print("Saliendo...")
        GPIO.cleanup()
        break

```

Calinbrar balanza

import time
import RPi.GPIO as GPIO
from hx711 import HX711

DT = 15  # GPIO12
SCK = 33  # GPIO13

hx = HX711(DT, SCK)
hx.set_reading_format("MSB", "MSB")
hx.tare()


