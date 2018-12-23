SELECT bmborrafuncion('fun_heconsultapuestosa');

CREATE OR REPLACE FUNCTION fun_heconsultapuestosa()
/***************************************************************************************
      FECHA: 20/ENE/2014
DESCRIPCION: CONSULTA LOS DIFERENTES PUESTOS DE EMPLEADO
    REALIZO: DIEGO ANTONIO RIVERA SAUCEDA
   SOLICITÓ: HECTOR SAMUEL MOLINA SANCHEZ
***************************************************************************************/
	RETURNS TABLE(
        numero integer,
        nombre varchar(30)
    ) AS
$BODY$
	BEGIN
		RETURN QUERY 
            -- &
            SELECT 
                a.numero, 
                REPLACE(
                    REPLACE(
                        REPLACE(
                            trim(a.nombre), '¾', 'Ñ'
                        ), '¥', 'Ñ'
                    ), 'à', 'Ó'
                )::VARCHAR(30) as nombre
            -- &
            FROM hecatalogopuestos a
            WHERE a.numero > 0
            -- &
            ORDER BY a.numero;
	END
$BODY$
	LANGUAGE 'plpgsql' VOLATILE;

GRANT EXECUTE ON FUNCTION fun_heconsultapuestosa() TO syshuellasemps;

COMMENT ON FUNCTION fun_heconsultapuestosa() IS
'CONSULTA LOS DIFERENTES PUESTOS DE EMPLEADO';