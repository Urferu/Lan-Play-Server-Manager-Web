SELECT bmborrafuncion('fun_heconsultanombreempleado');

CREATE OR REPLACE FUNCTION fun_heconsultanombreempleado(p_idu_empleado INTEGER)
/***************************************************************************************
      FECHA: 20/SEPT/2017
DESCRIPCION: CONSULTA EL NOMBRE DEL EMPLEADO
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
***************************************************************************************/
	RETURNS TABLE(
        num_empleado integer,
        nom_empleado_combinado TEXT
    ) AS
$BODY$
	BEGIN
		RETURN QUERY 
            -- &
            SELECT 
                a.numemp, 
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                TRIM(a.nombre)
                                || ' ' ||
                                TRIM(a.apellidopaterno)
                                || ' ' ||
                                TRIM(a.apellidomaterno), '¾', 'Ñ'
                            ), '#', 'Ñ'
                        ), '¥', 'Ñ'
                    ), 'à', 'Ó'
                ) AS nombre
            -- &
            FROM hecatalogoempleados a
            WHERE a.numemp = p_idu_empleado
            -- &
            ORDER BY a.numemp;
	END
$BODY$
	LANGUAGE 'plpgsql' VOLATILE;

GRANT EXECUTE ON FUNCTION fun_heconsultanombreempleado(INTEGER) TO syshuellasemps;

COMMENT ON FUNCTION fun_heconsultanombreempleado(INTEGER) IS
'CONSULTA EL NOMBRE DEL EMPLEADO';