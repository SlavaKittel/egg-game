const Component = () => {
  return (
    <>
      <mesh rotation={[0, 10, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={"#6be092"} />
      </mesh>
      <ambientLight
        color="#fff"
        intensity={1}
      />
      <directionalLight
        color="#fff"
        intensity={1}
        position={[0, 0, 5]}
      />
    </>
  );
};

export default Component;
