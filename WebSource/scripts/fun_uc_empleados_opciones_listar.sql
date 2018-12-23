CREATE OR REPLACE FUNCTION fun_uc_empleados_opciones_listar(p_idu_empleado INTEGER, p_idu_puesto INTEGER)
/********************************************************************************************************
      FECHA:  08/09/2017.
DESCRIPCION:  LISTA LAS OPCIONES A LAS QUE TIENE PERMISO EL EMPLEADO.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
RETURNS TABLE
    (
        idu_menu_categoria SMALLINT,
        idu_menu_opcion SMALLINT,
        nom_menu_categoria VARCHAR(50),
        nom_menu_opcion VARCHAR(50),
        des_url VARCHAR(100),
        nom_state VARCHAR(50),
        nom_icono VARCHAR(50)
    )
    AS
$BODY$
BEGIN
	RETURN QUERY
		SELECT tmp.idu_menu_categoria, tmp.idu_menu_opcion,
            tmp.nom_menu_categoria, tmp.nom_menu_opcion,
			tmp.des_url, tmp.nom_state, tmp.nom_icono
		FROM(
            SELECT c.idu_menu_categoria,
                o.idu_menu_opcion,
                c.nom_menu_categoria,
                o.nom_menu_opcion,
				o.des_url, o.nom_state, c.nom_icono,
				c.num_orden AS num_orden_c,
				o.num_orden AS num_orden_o
            FROM cat_uc_menu_opciones_puestos ep
            INNER JOIN cat_uc_menu_opciones o ON ep.idu_menu_opcion = o.idu_menu_opcion
                AND ep.idu_menu_categoria = o.idu_menu_categoria
			INNER JOIN cat_uc_menu_categorias c ON o.idu_menu_categoria = c.idu_menu_categoria
			WHERE ep.idu_puesto = p_idu_puesto
            
            UNION
        
			SELECT c.idu_menu_categoria,
                o.idu_menu_opcion,
                c.nom_menu_categoria, 
                o.nom_menu_opcion
                , o.des_url, o.nom_state, c.nom_icono
                , c.num_orden AS num_orden_c, o.num_orden AS num_orden_o
			FROM cat_uc_menu_opciones_empleados eo
			INNER JOIN cat_uc_menu_opciones o ON eo.idu_menu_opcion = o.idu_menu_opcion
                AND eo.idu_menu_categoria = o.idu_menu_categoria
			INNER JOIN cat_uc_menu_categorias c ON o.idu_menu_categoria = c.idu_menu_categoria
			WHERE eo.idu_empleado = p_idu_empleado
		) tmp
		ORDER BY tmp.num_orden_c, tmp.num_orden_o;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
GRANT EXECUTE ON FUNCTION fun_uc_empleados_opciones_listar(INTEGER, INTEGER) TO sysutileria;

COMMENT ON FUNCTION fun_uc_empleados_opciones_listar(INTEGER, INTEGER) IS 
'LISTA LAS OPCIONES A LAS QUE TIENE PERMISO EL EMPLEADO.';